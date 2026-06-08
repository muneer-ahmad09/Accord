package com.accord.backend.enums;

public enum ContractStatus {
    DRAFT,      // Being drafted
    SENT,       // Emailed for signature
    VIEWED,     // Client opened the link (great for read-receipts)
    SIGNED,     // Cryptographically signed
    EXPIRED     // Passed the validity date without signature
}