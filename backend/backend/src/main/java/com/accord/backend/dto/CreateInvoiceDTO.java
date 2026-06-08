package com.accord.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateInvoiceDTO {
    private String clientId;
    private String projectId; // Nullable (optional)
    private String invoiceNumber; // e.g., "INV-001"
    private BigDecimal amount;
    private String currency; // e.g., "USD"
    private LocalDate dueDate;
}
