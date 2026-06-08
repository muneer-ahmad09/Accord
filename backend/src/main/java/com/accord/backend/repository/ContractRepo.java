package com.accord.backend.repository;

import com.accord.backend.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContractRepo extends JpaRepository<Contract, UUID> {
    Page<Contract> findByProjectId(UUID projectId, Pageable pageable);
    Page<Contract> findByUserId(UUID userId, Pageable pageable);
    Optional <Contract> findByIdAndUserId(UUID id, UUID userId);

}
