package com.accord.backend.enums;

public enum InvoiceStatus {
    DRAFT,      // Being edited by the agency
    SENT,       // Emailed to the foreign client
    PAID,       // Stripe webhook confirmed payment
    OVERDUE,    // Past the due date
    VOID        // Cancelled before payment
}
