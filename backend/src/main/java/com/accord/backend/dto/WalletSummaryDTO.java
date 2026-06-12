package com.accord.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class WalletSummaryDTO {
    private BigDecimal availableBalance;
    private BigDecimal pendingBalance;
    private BigDecimal salesGrowth;
    private List<TransactionDTO> recentActivity;
}
