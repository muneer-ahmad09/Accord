package com.accord.backend.repository;

import com.accord.backend.entity.WalletLedger;
import com.accord.backend.enums.LedgerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface WalletLedgerRepo extends JpaRepository<WalletLedger, UUID> {

    // For paginated transaction history
    Page<WalletLedger> findByUserId(UUID userId, Pageable pageable);

    // CRITICAL: Tells PostgreSQL to sum the amounts directly in the database
    @Query("SELECT SUM(w.amountInr) FROM WalletLedger w WHERE w.userId = :userId AND w.status = :status")
    BigDecimal calculateTotalBalanceByStatus(@Param("userId") UUID userId, @Param("status") LedgerStatus status);


    // Finds all entries (credits and platform fees) attached to a specific invoice in a specific state
    List<WalletLedger> findByInvoiceIdAndStatus(UUID invoiceId, LedgerStatus status);
}
