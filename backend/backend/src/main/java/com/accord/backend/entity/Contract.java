package com.accord.backend.entity;

import com.accord.backend.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // 1. Relationship to the Project table (Nullable, because some contracts are general)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // 2. Relationship to the Client table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // 3. Security/Ownership (Kept as raw UUID to make security checks faster without loading the User object)
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String type; // e.g., "NDA", "MSA"

    // 4. CRITICAL: Forces the DB to save "SIGNED" or "DRAFT" instead of 0 or 1
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    @Column(name = "document_url", length = 512)
    private String documentUrl;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void setStatus(ContractStatus contractStatus) {
    }
}