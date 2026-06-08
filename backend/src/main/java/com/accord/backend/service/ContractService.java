package com.accord.backend.service;

import com.accord.backend.dto.CreateContractDTO;
import com.accord.backend.dto.ContractResponseDTO;
import com.accord.backend.entity.Client;
import com.accord.backend.entity.Contract;
import com.accord.backend.entity.Project;
import com.accord.backend.enums.ContractStatus;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.ClientRepo;
import com.accord.backend.repository.ContractRepo;
import com.accord.backend.repository.ProjectRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepo contractRepo;
    private final ClientRepo clientRepo;
    private final ProjectRepo projectRepo;

    public Page<ContractResponseDTO> getAllContracts(String userId, Pageable pageable) {
        Page<Contract> contracts = contractRepo.findByUserId(convertToUUID(userId), pageable);
        return contracts.map(this::convertToDTO);
    }

    public ContractResponseDTO getContractById(String contractId, String userId) {
        Contract contract = contractRepo.findByIdAndUserId(convertToUUID(contractId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found or access denied."));
        return convertToDTO(contract);
    }

    @Transactional
    public ContractResponseDTO createContract(String userId, CreateContractDTO dto) {
        UUID userUuid = convertToUUID(userId);

        // 1. Strict Security Check: Does this client exist AND belong to the logged-in user?
        Client client = clientRepo.findByIdAndUserId(convertToUUID(dto.getClientId()), userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Client ID or access denied."));

        Contract newContract = new Contract();
        newContract.setUserId(userUuid);
        newContract.setClient(client);
        newContract.setType(dto.getType());

        // Default state for all brand new contracts
        newContract.setStatus(ContractStatus.DRAFT);

        // 2. Optional Project Linkage: If a project ID is provided, verify and attach it
        if (dto.getProjectId() != null && !dto.getProjectId().isBlank()) {
            Project project = projectRepo.findByIdAndAgencyId(convertToUUID(dto.getProjectId()), userUuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Project ID or access denied."));
            newContract.setProject(project);
        }

        Contract savedContract = contractRepo.save(newContract);
        return convertToDTO(savedContract);
    }

    @Transactional
    public ContractResponseDTO updateContractStatus(String contractId, String userId, ContractStatus newStatus) {
        Contract contract = contractRepo.findByIdAndUserId(convertToUUID(contractId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found or access denied."));

        contract.setStatus(newStatus);

        // If the contract is being signed, timestamp it automatically
        if (newStatus == ContractStatus.SIGNED && contract.getSignedAt() == null) {
            contract.setSignedAt(java.time.LocalDateTime.now());
        }

        Contract updatedContract = contractRepo.save(contract);
        return convertToDTO(updatedContract);
    }

    // --- Helper Methods ---

    private UUID convertToUUID(String id) {
        return UUID.fromString(id);
    }

    private ContractResponseDTO convertToDTO(Contract contract) {
        ContractResponseDTO dto = new ContractResponseDTO();
        dto.setId(contract.getId());
        dto.setClientId(contract.getClient().getId());

        // Safely check if a project exists before extracting its ID
        if (contract.getProject() != null) {
            dto.setProjectId(contract.getProject().getId());
        }

        dto.setType(contract.getType());
        dto.setStatus(contract.getStatus());
        dto.setDocumentUrl(contract.getDocumentUrl());
        dto.setSignedAt(contract.getSignedAt());
        dto.setCreatedAt(contract.getCreatedAt());
        return dto;
    }
}