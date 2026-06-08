package com.accord.backend.controller;

import com.accord.backend.dto.*;
import com.accord.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO dto) {
        return ResponseEntity.ok(authService.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.authenticateUser(dto));
    }

    @PostMapping("/onboarding/details")
    public ResponseEntity<String> saveOnboardingDetails(
            @RequestAttribute("userId") String userId, // Extracted securely from JWT Filter
            @RequestBody OnboardingDetailsDTO dto) {
        authService.saveOnboardingDetails(userId, dto);
        return ResponseEntity.ok("Onboarding details updated successfully.");
    }

    @PostMapping("/onboarding/stripe-link")
    public ResponseEntity<Map<String, String>> generateStripeLink(@RequestAttribute("userId") String userId) {
        String setupUrl = authService.generateStripeOnboardingLink(userId);
        return ResponseEntity.ok(Map.of("url", setupUrl));
    }

    @GetMapping("/onboarding/status")
    public ResponseEntity<OnboardingStatusDTO> getOnboardingStatus(@RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(authService.getOnboardingStatus(userId));
    }
}