package com.accord.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ClientMetricsDTO {
    private int totalCustomers;
    private int newCustomersThisMonth;

    // The two requested metrics
    private BigDecimal newCustomersPct;    // e.g., 14.00
    private BigDecimal newCustomersGrowth; // e.g., 40.00
}
