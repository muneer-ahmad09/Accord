package com.accord.backend.service;

import com.accord.backend.dto.TransactionDTO;
import com.accord.backend.dto.WalletSummaryDTO;
import com.accord.backend.entity.Invoice;
import com.accord.backend.entity.WalletLedger;
import com.accord.backend.enums.LedgerStatus;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.InvoiceRepo;
import com.accord.backend.repository.WalletLedgerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletLedgerRepo ledgerRepo;
    private final InvoiceRepo invoiceRepo;



    public WalletSummaryDTO getWalletSummary(String userId) {
        UUID userUuid = convertToUUID(userId);

        // 1. Fetch overall balances
        BigDecimal available = ledgerRepo.calculateTotalBalanceByStatus(userUuid, LedgerStatus.SETTLED);
        BigDecimal pending = ledgerRepo.calculateTotalBalanceByStatus(userUuid, LedgerStatus.PROCESSING);

        available = available != null ? available : BigDecimal.ZERO;
        pending = pending != null ? pending : BigDecimal.ZERO;

        // 2. Fetch the 5 most recent transactions
        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<TransactionDTO> recentActivity = ledgerRepo.findByUserId(userUuid, topFive)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // 3. Calculate Sales Growth
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfCurrentMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        YearMonth lastMonth = currentMonth.minusMonths(1);
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfLastMonth = currentMonth.atDay(1).atStartOfDay().minusNanos(1);

        BigDecimal currentMonthSales = ledgerRepo.sumSettledRevenueBetweenDates(userUuid, startOfCurrentMonth, now);
        BigDecimal lastMonthSales = ledgerRepo.sumSettledRevenueBetweenDates(userUuid, startOfLastMonth, endOfLastMonth);

         BigDecimal salesGrowth = calculateGrowthPercentage(currentMonthSales, lastMonthSales);

        // 4. Build the Response
        WalletSummaryDTO summary = new WalletSummaryDTO();
        summary.setAvailableBalance(available);
        summary.setPendingBalance(pending);
        summary.setSalesGrowth(salesGrowth);
        summary.setRecentActivity(recentActivity);

        return summary;
    }

    public Page<TransactionDTO> getTransactionHistory(String userId, Pageable pageable) {
        return ledgerRepo.findByUserId(convertToUUID(userId), pageable)
                .map(this::convertToDTO);
    }

    // --- 2. Core Financial Write Methods (Internal / Webhook use) ---

    @Transactional
    public void recordInvoicePayment(String userId, String invoiceId, BigDecimal amountInr, BigDecimal fxRate) {
        UUID userUuid = convertToUUID(userId);

        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found."));

        // 1. Record the Gross Income
        WalletLedger credit = new WalletLedger();
        credit.setUserId(userUuid);
        credit.setInvoice(invoice);
        credit.setType("INVOICE_PAID");
        credit.setAmountInr(amountInr); // Positive amount
        credit.setFxRateApplied(fxRate);
        credit.setStatus(LedgerStatus.PROCESSING); // Waiting for bank clearance
        ledgerRepo.save(credit);

        // 2. Record the Platform Fee Deduction (e.g., 2%)
        BigDecimal feePercentage = new BigDecimal("0.02");
        // Always round financial deductions safely to 2 decimal places
        BigDecimal platformFee = amountInr.multiply(feePercentage).setScale(2, java.math.RoundingMode.HALF_UP);

        WalletLedger debit = new WalletLedger();
        debit.setUserId(userUuid);
        debit.setInvoice(invoice);
        debit.setType("PLATFORM_FEE");
        debit.setAmountInr(platformFee.negate()); // Negative amount for deduction
        debit.setFxRateApplied(fxRate);
        debit.setStatus(LedgerStatus.PROCESSING);
        ledgerRepo.save(debit);
    }

    // --- THE WITHDRAWAL METHOD: Handles moving money to the bank account ---
    @Transactional
    public void processPayout(String userId, BigDecimal amountToWithdrawInr) {
        UUID userUuid = convertToUUID(userId);

        // 1. Verify they actually have enough settled funds available
        BigDecimal available = ledgerRepo.calculateTotalBalanceByStatus(userUuid, LedgerStatus.SETTLED);
        available = available != null ? available : BigDecimal.ZERO;

        // 2. Security Check: Block over-drafting
        if (available.compareTo(amountToWithdrawInr) < 0) {
            throw new IllegalArgumentException("Insufficient settled funds for withdrawal.");
        }

        // 3. Record the withdrawal debit line item in the ledger
        WalletLedger withdrawal = new WalletLedger();
        withdrawal.setUserId(userUuid);
        withdrawal.setType("WITHDRAWAL");

        // .negate() ensures this is saved as a negative number in the database
        withdrawal.setAmountInr(amountToWithdrawInr.negate());

        // FX rate is 1 because we are moving INR to an INR bank account
        withdrawal.setFxRateApplied(BigDecimal.ONE);

        // Set to SETTLED so it instantly deducts from the "Available Balance" calculation
        withdrawal.setStatus(LedgerStatus.SETTLED);

        ledgerRepo.save(withdrawal);
    }

    // --- THE SETTLEMENT METHOD: Transitions pending money to available ---
    @Transactional
    public void settlePendingFunds(String invoiceId) {
        UUID invoiceUuid = convertToUUID(invoiceId);

        // Fetch all PROCESSING ledger entries related to this specific invoice
        List<WalletLedger> pendingEntries = ledgerRepo.findByInvoiceIdAndStatus(invoiceUuid, LedgerStatus.PROCESSING);

        if (pendingEntries.isEmpty()) {
            throw new IllegalStateException("No pending funds found for this invoice.");
        }

        // Update all entries (both the credit and the platform fee debit) to SETTLED
        for (WalletLedger entry : pendingEntries) {
            entry.setStatus(LedgerStatus.SETTLED);
        }

        // Save the updated statuses to the database
        ledgerRepo.saveAll(pendingEntries);
    }

    // --- Helper Methods ---

    private UUID convertToUUID(String id) {
        return UUID.fromString(id);
    }

    private TransactionDTO convertToDTO(WalletLedger ledger) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(ledger.getId());

        if (ledger.getInvoice() != null) {
            dto.setInvoiceId(ledger.getInvoice().getId());
        }

        dto.setType(ledger.getType());
        dto.setAmountInr(ledger.getAmountInr());
        dto.setFxRateApplied(ledger.getFxRateApplied());
        dto.setStatus(ledger.getStatus());
        dto.setCreatedAt(ledger.getCreatedAt());
        return dto;
    }

    private BigDecimal calculateGrowthPercentage(BigDecimal current, BigDecimal prior) {

        // Handle Division by Zero Edge Cases
        if (prior.compareTo(BigDecimal.ZERO) == 0) {
            if (current.compareTo(BigDecimal.ZERO) > 0) {
                return new BigDecimal("100.00"); // Grew from 0 to something
            }
            return BigDecimal.ZERO; // Stayed at 0
        }

        BigDecimal difference = current.subtract(prior);

        // (Difference / Prior) * 100
        return difference.divide(prior, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
    }
}