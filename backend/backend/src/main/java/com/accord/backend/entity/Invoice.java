package com.accord.backend.entity;

import com.accord.backend.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relationship to the Project (Nullable, if invoice is general)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // Relationship to the Client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // Security check: Ties the invoice to your specific agency
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber; // e.g., "INV-001"

    // CRITICAL: BigDecimal prevents floating point rounding errors
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency; // e.g., "USD"

    // Forces DB to save "SENT" or "PAID", not 0 or 1
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;

    @Column(name = "stripe_payment_intent")
    private String stripePaymentIntent;

    // LocalDate is better for deadlines than LocalDateTime
    @Column(name = "due_date")
    private LocalDate dueDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}