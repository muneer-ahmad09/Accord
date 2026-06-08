package com.accord.backend.dto;

import com.accord.backend.enums.LedgerStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionDTO {
    private UUID id;
    private UUID invoiceId; // Nullable
    private String type; // e.g., "INVOICE_PAID", "PLATFORM_FEE", "WITHDRAWAL"
    private BigDecimal amountInr;
    private BigDecimal fxRateApplied;
    private LedgerStatus status;
    private LocalDateTime createdAt;
}
