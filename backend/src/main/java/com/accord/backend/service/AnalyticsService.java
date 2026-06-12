package com.accord.backend.service;

import com.accord.backend.dto.MonthlyChartDataDTO;
import com.accord.backend.dto.TrafficSourceDTO;
import com.accord.backend.repository.ClientRepo;
import com.accord.backend.repository.WalletLedgerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private WalletLedgerRepo walletLedgerRepo;

    // Feeds the Line Chart
    public List<MonthlyChartDataDTO> getYearlyRevenueVsProfit(UUID userId, int year) {

        // 1. Pre-fill the 12 months with zeros so the UI chart never breaks on empty months
        List<MonthlyChartDataDTO> yearlyData = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        for (String month : months) {
            yearlyData.add(new MonthlyChartDataDTO(month, BigDecimal.ZERO, BigDecimal.ZERO));
        }

        // 2. Fetch the aggregated data from PostgreSQL
        List<Object[]> dbResults = walletLedgerRepo.getMonthlyRevenueAndFees(userId, year);

        // 3. Map the DB results into our pre-filled array
        for (Object[] row : dbResults) {
            // PostgreSQL EXTRACT(MONTH) returns a number (1 for Jan, 2 for Feb)
            // We subtract 1 to match our Java List index (0 to 11)
            int monthIndex = ((Number) row[0]).intValue() - 1;

            // Safely parse the BigDecimal values from the database row
            BigDecimal revenue = (row[1] != null) ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            BigDecimal fees = (row[2] != null) ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;

            // Profit calculation: Revenue minus Platform Fees
            BigDecimal profit = revenue.subtract(fees);

            // Fetch the specific month from our pre-filled list and update its values
            MonthlyChartDataDTO monthData = yearlyData.get(monthIndex);
            monthData.setRevenue(revenue.setScale(2, java.math.RoundingMode.HALF_UP));
            monthData.setProfit(profit.setScale(2, java.math.RoundingMode.HALF_UP));
        }

        return yearlyData;
    }
    public List<TrafficSourceDTO> getTrafficSources(UUID userId) {

        List<Object[]> rawData = clientRepo.countClientsByLeadSource(userId);

        List<TrafficSourceDTO> sources = new ArrayList<>();

        for (Object[] row : rawData) {
            String sourceName = String.valueOf(row[0]);

            int count = ((Long) row[1]).intValue();

            sources.add(new TrafficSourceDTO(sourceName, count));
        }

        return sources;
    }

}