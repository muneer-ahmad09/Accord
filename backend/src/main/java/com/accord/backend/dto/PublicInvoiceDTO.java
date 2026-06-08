package com.accord.backend.dto;

import com.accord.backend.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PublicInvoiceDTO {
    // We send the Invoice ID so the frontend can request the Stripe Session later
    private String invoiceId;

    // Who is getting paid
    private String agencyName;

    // Who is paying
    private String clientCompanyName;

    // The Financials
    private String invoiceNumber;
    private BigDecimal amount;
    private String currency;
    private LocalDate dueDate;
    private InvoiceStatus status;
}
