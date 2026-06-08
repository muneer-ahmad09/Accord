package com.accord.backend.controller;

import com.accord.backend.dto.CreateUpdateClientDTO;
import com.accord.backend.dto.GetClientsDTO;
import com.accord.backend.service.ClientServiceIInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientServiceIInterface clientService;

    @GetMapping
    public ResponseEntity<Page<GetClientsDTO>> getAllClients(
            @RequestAttribute("userId") String userId,
            Pageable pageable) {

        Page<GetClientsDTO> clients = clientService.getAllClients(userId, pageable);
        return ResponseEntity.ok(clients);
    }

    /**
     * Fetch a single client's profile securely using both client ID and owner user ID.
     */
    @GetMapping("/{clientId}")
    public ResponseEntity<GetClientsDTO> getClientById(
            @PathVariable String clientId,
            @RequestAttribute("userId") String userId) {

        GetClientsDTO client = clientService.getClientById(clientId, userId);
        return ResponseEntity.ok(client);
    }

    /**
     * Register a brand new corporate client under the user's account.
     */
    @PostMapping
    public ResponseEntity<GetClientsDTO> createClient(
            @RequestAttribute("userId") String userId,
            @RequestBody CreateUpdateClientDTO dto) {

        GetClientsDTO createdClient = clientService.createClient(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
    }

    /**
     * Update an existing client's details while verifying they belong to the user making the request.
     */
    @PutMapping("/{clientId}")
    public ResponseEntity<GetClientsDTO> updateClient(
            @PathVariable String clientId,
            @RequestAttribute("userId") String userId,
            @RequestBody CreateUpdateClientDTO dto) {

        GetClientsDTO updatedClient = clientService.updateClient(clientId, userId, dto);
        return ResponseEntity.ok(updatedClient);
    }
}