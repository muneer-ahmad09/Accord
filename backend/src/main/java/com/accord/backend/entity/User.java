package com.accord.backend.entity;

import com.accord.backend.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "users") // CRITICAL: Prevents PostgreSQL crash
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Enforces that emails must be present and absolutely unique
    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "email_otp")
    private String emailOtpHash;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    @Column(name = "password_hashed", nullable = false)
    private String passwordHashed;

    @Column(name = "agency_name", nullable = false)
    private String agencyName;

    @Column(name = "tax_id")
    private String taxId; // GSTIN or PAN

    @Column(name = "stripe_account_id")
    private String stripeAccountId;

    // FIX: Replaced @Column with @ElementCollection to support a List of Enums
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role_name")
    @Enumerated(EnumType.STRING)
    private List<Role> role = new ArrayList<>(List.of(Role.USER));

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


}