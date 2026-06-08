package com.accord.backend.entity;

import com.accord.backend.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // A project belongs to one client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // A project belongs to one agency (Security/Isolation)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User agency;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    // One Project has Many Invoices
    @OneToMany(mappedBy = "project")
    private List<Invoice> invoices;

    // One Project has Many Contracts
    @OneToMany(mappedBy = "project")
    private List<Contract> contracts;

}
