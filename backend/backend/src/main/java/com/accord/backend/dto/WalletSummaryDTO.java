package com.accord.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class WalletSummaryDTO {
    private BigDecimal availableBalance; // Fully settled and ready to withdraw
    private BigDecimal pendingBalance;   // Processing via Stripe
    private List<TransactionDTO> recentActivity; // Top 5-10 recent transactions
}
