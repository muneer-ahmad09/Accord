package com.accord.backend.service;

import com.accord.backend.dto.*;
import com.accord.backend.entity.User;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;

    @Transactional
    public AuthResponseDTO registerUser(RegisterDTO dto) {
        // Enforce unique email check at application level
        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setAgencyName(dto.getAgencyName());

        // TODO: Replace with: passwordEncoder.encode(dto.getPassword())
        user.setPasswordHashed(dto.getPassword());

        User savedUser = userRepo.save(user);

        // TODO: Generate actual JWT token using your JwtTokenProvider utility class
        String mockJwtToken = "mock-jwt-token-for-" + savedUser.getId();

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(mockJwtToken);
        response.setEmail(savedUser.getEmail());
        response.setAgencyName(savedUser.getAgencyName());
        return response;
    }

    public AuthResponseDTO authenticateUser(LoginDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password."));

        // TODO: Replace with validation check: passwordEncoder.matches(dto.getPassword(), user.getPasswordHashed())
        if (!dto.getPassword().equals(user.getPasswordHashed())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // TODO: Generate actual JWT token
        String mockJwtToken = "mock-jwt-token-for-" + user.getId();

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(mockJwtToken);
        response.setEmail(user.getEmail());
        response.setAgencyName(user.getAgencyName());
        return response;
    }

    @Transactional
    public void saveOnboardingDetails(String userId, OnboardingDetailsDTO dto) {
        User user = userRepo.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        user.setTaxId(dto.getTaxId());
        userRepo.save(user);
    }

    public String generateStripeOnboardingLink(String userId) {
        User user = userRepo.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        // If you are proceeding with Stripe Connect (e.g., via US LLC or Invite), you build the redirect URL here.
        // If pivoting to a alternative/custom bank setup, replace this with your platform account configuration routing.
        if (user.getStripeAccountId() == null || user.getStripeAccountId().isBlank()) {
            // Internal logic to provision a brand new connected account on Stripe if one doesn't exist
            String generatedStripeId = "acct_mockedId123";
            user.setStripeAccountId(generatedStripeId);
            userRepo.save(user);
        }

        // Return the initialization link for the onboarding wizard
        return "https://connect.stripe.com/express/oauth/authorize?client_id=ca_mock&state=" + userId;
    }

    public OnboardingStatusDTO getOnboardingStatus(String userId) {
        User user = userRepo.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        boolean detailsCompleted = user.getTaxId() != null && !user.getTaxId().isBlank();
        boolean paymentConnected = user.getStripeAccountId() != null && !user.getStripeAccountId().isBlank();

        OnboardingStatusDTO status = new OnboardingStatusDTO();
        status.setDetailsCompleted(detailsCompleted);
        status.setPaymentConnected(paymentConnected);
        status.setFullyBoarded(detailsCompleted && paymentConnected);

        return status;
    }
}