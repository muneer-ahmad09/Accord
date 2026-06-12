package com.accord.backend.controller;

import com.accord.backend.dto.MonthlyChartDataDTO;
import com.accord.backend.dto.TrafficSourceDTO;
import com.accord.backend.service.AnalyticsService;
import com.accord.backend.utils.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;


    @GetMapping("/revenue-profit")
    public ResponseEntity<List<MonthlyChartDataDTO>> getRevenueAndProfitChart(
            @AuthenticationPrincipal UserDetailsImp userDetails,
            @RequestParam(defaultValue = "2026") int year) {
        UUID userId = userDetails.getUser().getId();
        return ResponseEntity.ok(analyticsService.getYearlyRevenueVsProfit(userId, year));
    }

    /**
     * Feeds the Donut/Pie Chart on the right sidebar
     */
    @GetMapping("/traffic-sources")
    public ResponseEntity<List<TrafficSourceDTO>> getTrafficSources(
            @AuthenticationPrincipal UserDetailsImp userDetailsd) {

        UUID userId = userDetailsd.getUser().getId();
        return ResponseEntity.ok(analyticsService.getTrafficSources(userId));
    }
}