package com.accord.backend.enums;

public enum LedgerStatus {
    PROCESSING, // Stripe is holding the funds
    SETTLED,    // Funds hit the HDFC bank account
    FAILED      // Payout bounced
}
