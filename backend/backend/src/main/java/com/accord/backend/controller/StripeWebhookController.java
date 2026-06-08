package com.accord.backend.controller;


import com.accord.backend.service.StripeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j // Lombok annotation for easy logging
@RestController
@RequestMapping("/public/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final StripeService stripeService;

    /**
     * CRITICAL: Notice @RequestBody String payload. Do NOT use a DTO here.
     * We need the exact raw text exactly as Stripe sent it to verify the signature.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            // Pass the raw text and the security header to the service layer
            stripeService.processWebhookEvent(payload, sigHeader);

            // You MUST return a 200 OK immediately upon success.
            // If you don't, Stripe assumes your server crashed and will retry the
            // exact same webhook up to 50 times over the next 3 days.
            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            log.error("Stripe Webhook Verification Failed: {}", e.getMessage());
            // Return 400 Bad Request to let Stripe know the ping was rejected
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook validation failed");
        }
    }
}
