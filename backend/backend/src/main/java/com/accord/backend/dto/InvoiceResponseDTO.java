package com.accord.backend.dto;

import com.accord.backend.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class InvoiceResponseDTO {
    private UUID id;
    private UUID clientId;
    private UUID projectId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String currency;
    private InvoiceStatus status;
    private String stripePaymentIntent;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}
