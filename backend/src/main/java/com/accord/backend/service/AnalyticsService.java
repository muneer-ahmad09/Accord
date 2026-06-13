package com.accord.backend.service;

import com.accord.backend.dto.MonthlyChartDataDTO;
import com.accord.backend.dto.TrafficSourceDTO;
import com.accord.backend.repository.ClientRepo;
import com.accord.backend.repository.WalletLedgerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private WalletLedgerRepo walletLedgerRepo;

    public List<MonthlyChartDataDTO> getRollingRevenue(UUID userId, int monthsToFetch) {

        List<MonthlyChartDataDTO> chartData = new ArrayList<>();

        YearMonth currentMonth = YearMonth.now();

        // 1. Pre-fill the array backward to ensure perfect chronological ordering
        // E.g., if monthsToFetch=12, loop from 11 months ago up to this month
        for (int i = monthsToFetch - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);

            // Gets a clean short name like "Jan", "Feb"
            String monthLabel = targetMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            chartData.add(new MonthlyChartDataDTO(monthLabel, BigDecimal.ZERO, BigDecimal.ZERO));
        }

        // 2. Calculate the exact database start date (1st day of the oldest month at 00:00)
        LocalDateTime startDate = currentMonth.minusMonths(monthsToFetch - 1).atDay(1).atStartOfDay();

        // 3. Fetch from PostgreSQL
        List<Object[]> dbResults = walletLedgerRepo.getRollingRevenueAndFees(userId, startDate);

        // 4. Map the DB results into the exact right slot in our pre-filled array
        for (Object[] row : dbResults) {
            int rowYear = ((Number) row[0]).intValue();
            int rowMonth = ((Number) row[1]).intValue();
            YearMonth rowYearMonth = YearMonth.of(rowYear, rowMonth);

            // Calculate which array index this month belongs to
            int index = (int) ChronoUnit.MONTHS.between(
                    currentMonth.minusMonths(monthsToFetch - 1),
                    rowYearMonth
            );

            // Safety check to ensure we only populate the requested timeline
            if (index >= 0 && index < monthsToFetch) {
                BigDecimal revenue = (row[2] != null) ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;
                BigDecimal fees = (row[3] != null) ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO;
                BigDecimal profit = revenue.subtract(fees);

                MonthlyChartDataDTO monthData = chartData.get(index);
                monthData.setRevenue(revenue.setScale(2, RoundingMode.HALF_UP));
                monthData.setProfit(profit.setScale(2, RoundingMode.HALF_UP));
            }
        }

        return chartData;
    }

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