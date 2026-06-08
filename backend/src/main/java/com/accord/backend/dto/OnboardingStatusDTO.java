package com.accord.backend.dto;

import lombok.Data;

@Data
public class OnboardingStatusDTO {
    private boolean detailsCompleted;
    private boolean paymentConnected;
    private boolean fullyBoarded;
}