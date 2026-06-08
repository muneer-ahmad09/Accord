package com.accord.backend.entity;

import com.accord.backend.enums.LedgerStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "wallet_ledger")
public class WalletLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Security check: Ensures this transaction only shows up in the correct user's wallet
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    // The Missing Link: Connects this money movement back to the specific invoice
    // Nullable, because a general bank payout sweep isn't tied to one specific invoice
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    // e.g., "INVOICE_PAID", "PLATFORM_FEE_DEDUCTION", "BANK_PAYOUT"
    @Column(nullable = false)
    private String type;

    // CRITICAL: BigDecimal prevents core wallet balance rounding errors
    @Column(name = "amount_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal amountInr;

    // High precision for exact currency conversion tracking (e.g., 83.4562)
    @Column(name = "fx_rate_applied", precision = 10, scale = 4)
    private BigDecimal fxRateApplied;

    // Forces DB to save "PROCESSING" or "SETTLED" as text
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}