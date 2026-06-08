package com.accord.backend.repository;

import com.accord.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepo extends JpaRepository<Client, UUID> {

    // Used for the CRM list view
    Page<Client> findByUserId(UUID userId, Pageable pageable);

    // Used for secure single-fetching and updates
    Optional<Client> findByIdAndUserId(UUID id, UUID userId);
}