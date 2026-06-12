package com.accord.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyChartDataDTO {
    private String month;
    private BigDecimal revenue;
    private BigDecimal profit;
}