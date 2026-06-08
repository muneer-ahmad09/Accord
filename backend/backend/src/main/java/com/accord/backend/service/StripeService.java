package com.accord.backend.service;

import com.accord.backend.entity.Invoice;
import com.accord.backend.entity.User;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.exception.StripeException;
import com.accord.backend.exceptions.ResourceNotFoundException;

import com.accord.backend.enums.InvoiceStatus;
import com.accord.backend.repository.InvoiceRepo;
import com.accord.backend.repository.UserRepo;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeService {

    private final WalletService walletService;
    private final InvoiceService invoiceService;
    private final InvoiceRepo  invoiceRepo;
    private final UserRepo userRepo;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    // Initializes the Stripe SDK globally when Spring Boot starts up
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public void processWebhookEvent(String payload, String sigHeader) {
        Event event = null;

        try {
            // 1. The Security Check: This mathematical function proves the request
            // actually came from Stripe and hasn't been tampered with.
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            // If this throws, it is a hacker. We rethrow to the controller to return a 400.
            throw new IllegalArgumentException("Invalid signature");
        }

        // 2. Deserialize the secure event data
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject == null) {
            log.warn("Stripe Event missing data object");
            return;
        }

        // 3. Route the event based on what happened in the real world
        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutCompleted((Session) stripeObject);
                break;

            // You can add more listeners later, like "payout.paid" or "charge.failed"
            default:
                log.info("Unhandled event type: {}", event.getType());
        }
    }

    private void handleCheckoutCompleted(Session session) {
        // When you create the checkout session, you must pass the invoice ID and User ID
        // into Stripe's "metadata" dictionary so it gets returned here.
        String invoiceId = session.getMetadata().get("invoiceId");
        String userId = session.getMetadata().get("userId");

        if (invoiceId == null || userId == null) {
            log.error("Received completed session but missing essential metadata.");
            return;
        }

        // Stripe sends money in the smallest currency unit (e.g., cents or paise)
        // So an $85.00 invoice comes back as "8500". We divide by 100 to get the real decimal.
        BigDecimal amountPaid = BigDecimal.valueOf(session.getAmountTotal()).divide(new BigDecimal("100"));

        // In a real multi-currency setup, you would fetch the live FX rate here.
        // For this example, we assume a static rate or 1:1 if already in INR.
        BigDecimal fxRateApplied = new BigDecimal("83.5000");

        // 1. Update the Invoice status to PAID in the database
        invoiceService.updateInvoiceStatus(invoiceId, userId, InvoiceStatus.PAID);

        // 2. Append the immutable financial records to the freelancer's wallet
        walletService.recordInvoicePayment(userId, invoiceId, amountPaid, fxRateApplied);

        log.info("Successfully processed payment for Invoice: {}", invoiceId);
    }


    public String createCheckoutSession(String invoiceId) {
        // 1. Fetch the invoice and the agency from the database
        Invoice invoice = invoiceRepo.findById(UUID.fromString(invoiceId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found."));

        User agency = userRepo.findById(invoice.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found."));

        // Ensure the agency has actually connected their bank account
        if (agency.getStripeAccountId() == null || agency.getStripeAccountId().isBlank()) {
            throw new IllegalStateException("Agency has not connected their Stripe payout account.");
        }

        // 2. Stripe expects all money to be in the smallest currency unit (cents).
        // We multiply your BigDecimal amount by 100.
        long amountInCents = invoice.getAmount().multiply(new BigDecimal("100")).longValue();

        // 3. Calculate your Platform Fee (e.g., 2%)
        long platformFeeInCents = (long) (amountInCents * 0.02);

        try {
            // 4. Build the Stripe Checkout Session
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)

                    // Where the user goes after paying (Replace with your actual React URLs)
                    .setSuccessUrl("https://checkout.accord.com/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("https://checkout.accord.com/cancel")

                    // --- THE CRITICAL METADATA ---
                    // This is what Stripe holds onto and hands back to your Webhook later
                    .putMetadata("invoiceId", invoice.getId().toString())
                    .putMetadata("userId", agency.getId().toString())

                    // What the client actually sees on the receipt
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency(invoice.getCurrency().toLowerCase())
                                                    .setUnitAmount(amountInCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Invoice: " + invoice.getInvoiceNumber())
                                                                    .setDescription("Payment to " + agency.getAgencyName())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )

                    // --- THE FINANCIAL ROUTING ---
                    .setPaymentIntentData(
                            SessionCreateParams.PaymentIntentData.builder()
                                    // Deduct your 2% cut automatically
                                    .setApplicationFeeAmount(platformFeeInCents)

                                    // Send the remaining 98% directly to the Indian freelancer
                                    .setTransferData(
                                            SessionCreateParams.PaymentIntentData.TransferData.builder()
                                                    .setDestination(agency.getStripeAccountId())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            // 5. Fire the request to Stripe's servers
            Session session = Session.create(params);

            // 6. Return the secure hosted URL generated by Stripe
            return session.getUrl();

        } catch (StripeException e) {
            log.error("Failed to create Stripe session for Invoice {}: {}", invoiceId, e.getMessage());
            throw new RuntimeException("Payment gateway is currently unavailable.");
        }
    }
}