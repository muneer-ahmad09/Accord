package com.accord.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
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

    @Column(name = "password_hashed", nullable = false)
    private String passwordHashed;

    @Column(name = "agency_name", nullable = false)
    private String agencyName;

    @Column(name = "tax_id")
    private String taxId; // GSTIN or PAN

    @Column(name = "stripe_account_id")
    private String stripeAccountId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}