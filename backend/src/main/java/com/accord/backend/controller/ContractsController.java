package com.accord.backend.controller;

import com.accord.backend.dto.ContractResponseDTO;
import com.accord.backend.dto.CreateContractDTO;
import com.accord.backend.enums.ContractStatus;
import com.accord.backend.service.ContractService;
import com.accord.backend.utils.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractsController {

    private final ContractService contractService;

    /**
     * Fetch a paginated list of contracts belonging to the authenticated agency user.
     */
    @GetMapping
    public ResponseEntity<Page<ContractResponseDTO>> getAllContracts(
            @AuthenticationPrincipal UserDetailsImp userDetails,
            Pageable pageable) {
        String userId = userDetails.getUser().getId().toString();
        Page<ContractResponseDTO> contracts = contractService.getAllContracts(userId, pageable);
        return ResponseEntity.ok(contracts);
    }

    /**
     * Fetch the details of a single contract by its unique ID.
     */
    @GetMapping("/{contractId}")
    public ResponseEntity<ContractResponseDTO> getContractById(
            @PathVariable String contractId,
            @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        ContractResponseDTO contract = contractService.getContractById(contractId, userId);
        return ResponseEntity.ok(contract);
    }

    /**
     * Generate a brand-new contract shell in DRAFT status.
     */
    @PostMapping("/generate")
    public ResponseEntity<ContractResponseDTO> generateContract(
            @AuthenticationPrincipal UserDetailsImp userDetails,
            @RequestBody CreateContractDTO dto) {
        String userId = userDetails.getUser().getId().toString();
        ContractResponseDTO createdContract = contractService.createContract(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContract);
    }

    /**
     * Transitions the contract state to SENT to indicate it has been forwarded to the client.
     */
    @PostMapping("/{contractId}/send")
    public ResponseEntity<ContractResponseDTO> sendContract(
            @PathVariable String contractId,
            @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        ContractResponseDTO updatedContract = contractService.updateContractStatus(contractId, userId, ContractStatus.SENT);
        return ResponseEntity.ok(updatedContract);
    }

    /**
     * Executed when the client electronically executes the document, timestamping the entry.
     */
    @PostMapping("/{contractId}/sign")
    public ResponseEntity<ContractResponseDTO> signContract(
            @PathVariable String contractId,
            @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        ContractResponseDTO updatedContract = contractService.updateContractStatus(contractId, userId, ContractStatus.SIGNED);
        return ResponseEntity.ok(updatedContract);
    }
}