package com.accord.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "clients") // Plural table name in the DB
public class Client { // Singular class name

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId; // Changed to camelCase

    @Column(name = "company_name", nullable = false)
    private String companyName; // Changed to camelCase

    @Column(name = "contact_email", nullable = false)
    private String contactEmail; // Changed to camelCase

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress; // Changed to camelCase

    @Column(nullable = false)
    private String country;

    // Establishing the relationship with the upgraded Projects table
    // FetchType.LAZY ensures projects are only loaded when explicitly requested
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Changed to camelCase
}