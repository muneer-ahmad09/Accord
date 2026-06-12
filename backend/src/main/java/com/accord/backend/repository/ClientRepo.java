package com.accord.backend.repository;

import com.accord.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepo extends JpaRepository<Client, UUID> {

    // Used for the CRM list view
    Page<Client> findByUserId(UUID userId, Pageable pageable);

    // Used for secure single-fetching and updates
    Optional<Client> findByIdAndUserId(UUID id, UUID userId);

    // Inside ClientRepo.java

    @Query("SELECT c.leadSource, COUNT(c) FROM Client c WHERE c.userId = :userId GROUP BY c.leadSource")
    List<Object[]> countClientsByLeadSource(UUID userId);

    long countByUserId(UUID userId);

    int countByUserIdAndCreatedAtBetween(UUID userId, LocalDateTime startDate, LocalDateTime endDate);
}