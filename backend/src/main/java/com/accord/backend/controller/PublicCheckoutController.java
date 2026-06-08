package com.accord.backend.controller;


import com.accord.backend.dto.PublicInvoiceDTO;
import com.accord.backend.service.CheckoutService;
import com.accord.backend.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // In production, replace "*" with your actual frontend domain
public class PublicCheckoutController {

    private final CheckoutService checkoutService;
    private final StripeService stripeService;

    /**
     * Called when the client's browser loads the checkout page.
     * Fetches the safe, masked invoice details.
     */
    @GetMapping("/{invoiceId}")
    public ResponseEntity<PublicInvoiceDTO> getPublicInvoiceDetails(@PathVariable String invoiceId) {
        PublicInvoiceDTO safeInvoice = checkoutService.getPublicInvoiceSummary(invoiceId);
        return ResponseEntity.ok(safeInvoice);
    }

    /**
     * Called when the client clicks the "Pay with Card / Bank" button.
     * Returns the secure Stripe Checkout URL that the frontend will redirect to.
     */
    @PostMapping("/{invoiceId}/session")
    public ResponseEntity<Map<String, String>> createStripeCheckoutSession(@PathVariable String invoiceId) {
        // The Stripe Service handles the complex math and API calls,
        // returning the secure URL hosted by Stripe.
        String stripeCheckoutUrl = stripeService.createCheckoutSession(invoiceId);

        // Return as a JSON object so the React frontend can easily parse it
        return ResponseEntity.ok(Map.of("url", stripeCheckoutUrl));
    }
}
