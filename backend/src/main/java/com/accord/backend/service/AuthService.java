package com.accord.backend.service;

import com.accord.backend.dto.*;
import com.accord.backend.entity.User;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final EmailService emailService;

    @Transactional
    public AuthResponseDTO registerUser(RegisterDTO dto) {
        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setAgencyName(dto.getAgencyName());
        user.setPasswordHashed(passwordEncoder.encode(dto.getPassword()));
        String otp = String.format("%06d",
                new Random().nextInt(999999));
        user.setEmailOtpHash(passwordEncoder.encode(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        User savedUser = userRepo.save(user);
        emailService.sendOtpEmail(savedUser.getEmail(), otp);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setEmail(savedUser.getEmail());
        response.setMessage("Register successful please verify your email.");
        return response;
    }


    public String authenticateUser(LoginDTO dto) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                dto.getEmail(),
                                dto.getPassword()
                        ));

        UserDetails user =
                (UserDetails) authentication.getPrincipal();

        return jwtService.generateToken(user);
    }

    @Transactional
    public String verifyEmail(VerifyEmailDTO dto) {

        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }

        if (user.getEmailOtpHash() == null ||
                !passwordEncoder.matches(dto.getOtp(), user.getEmailOtpHash())) {

            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setEmailVerified(true);

        user.setEmailOtpHash(null);
        user.setOtpExpiry(null);

        userRepo.save(user);

        return "Email verified successfully";
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