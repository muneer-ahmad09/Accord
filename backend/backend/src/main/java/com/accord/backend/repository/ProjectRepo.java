package com.accord.backend.repository;

import com.accord.backend.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepo extends JpaRepository<Project, UUID> {

    Optional<Project> findByIdAndAgencyId(
            UUID projectId,
            UUID agencyId
    );
    // Changed from findByIdAndUserId

    Page<Project> findByAgencyId(UUID userId, Pageable pageable);

}