package com.accord.backend.controller;

import com.accord.backend.dto.*;
import com.accord.backend.service.AuthService;
import com.accord.backend.utils.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestBody VerifyEmailDTO dto) {

        return ResponseEntity.ok(authService.verifyEmail(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO dto) {
        return ResponseEntity.ok(authService.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<LogInResponseDto > login(@RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.authenticateUser(dto));
    }

    @PostMapping("/onboarding/details")
    public ResponseEntity<String> saveOnboardingDetails(
            @AuthenticationPrincipal UserDetailsImp userDetails, // Extracted securely from JWT Filter
            @RequestBody OnboardingDetailsDTO dto) {
        String userId = userDetails.getUser().getId().toString();
        authService.saveOnboardingDetails(userId, dto);
        return ResponseEntity.ok("Onboarding details updated successfully.");
    }

    @PostMapping("/onboarding/stripe-link")
    public ResponseEntity<Map<String, String>> generateStripeLink( @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        String setupUrl = authService.generateStripeOnboardingLink(userId);
        return ResponseEntity.ok(Map.of("url", setupUrl));
    }

    @GetMapping("/onboarding/status")
    public ResponseEntity<OnboardingStatusDTO> getOnboardingStatus( @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        return ResponseEntity.ok(authService.getOnboardingStatus(userId));
    }
}