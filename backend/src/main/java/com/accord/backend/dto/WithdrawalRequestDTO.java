package com.accord.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WithdrawalRequestDTO {
    private BigDecimal amount;
}