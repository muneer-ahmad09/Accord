package com.accord.backend.controller;

import com.accord.backend.dto.TransactionDTO;
import com.accord.backend.dto.WalletSummaryDTO;
import com.accord.backend.dto.WithdrawalRequestDTO;
import com.accord.backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    /**
     * Fetches the top-level dashboard data: Available balance, pending balance,
     * and a snapshot of recent activity.
     */
    @GetMapping("/summary")
    public ResponseEntity<WalletSummaryDTO> getSummary(
            @RequestAttribute("userId") String userId) {

        WalletSummaryDTO summary = walletService.getWalletSummary(userId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Fetches the deeply paginated ledger of all historical transactions
     * (credits, debits, withdrawals, fees).
     */
    @GetMapping("/transactions")
    public ResponseEntity<Page<TransactionDTO>> getTransactions(
            @RequestAttribute("userId") String userId,
            Pageable pageable) {

        Page<TransactionDTO> transactions = walletService.getTransactionHistory(userId, pageable);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Initiates a transfer of settled funds from the platform wallet to the user's connected bank account.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(
            @RequestAttribute("userId") String userId,
            @RequestBody WithdrawalRequestDTO dto) {

        // This invokes the processPayout method required to debit the ledger
        walletService.processPayout(userId, dto.getAmount());
        return ResponseEntity.ok("Withdrawal initiated successfully.");
    }
}