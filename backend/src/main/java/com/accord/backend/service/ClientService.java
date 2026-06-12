package com.accord.backend.service;

import com.accord.backend.dto.ClientMetricsDTO;
import com.accord.backend.dto.CreateUpdateClientDTO;
import com.accord.backend.dto.GetClientsDTO;

import com.accord.backend.entity.Client;
import com.accord.backend.exceptions.ClientNotFoundException;
import com.accord.backend.repository.ClientRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.UUID;


@Service
@RequiredArgsConstructor // Automatically creates the constructor for clientRepo
public class ClientService implements ClientServiceIInterface {

    private final ClientRepo clientRepo;



    @Override
    public Page<GetClientsDTO> getAllClients(String userId, Pageable pageable) {
        Page<Client> listOfClients = clientRepo.findByUserId(convertToUUID(userId), pageable);
        return listOfClients.map(this::convertToDTO);
    }

    // SECURITY UPGRADE: Requires both clientId AND userId
    @Override
    public GetClientsDTO getClientById(String clientId, String userId) {
        Client client = clientRepo.findByIdAndUserId(convertToUUID(clientId), convertToUUID(userId))
                .orElseThrow(() -> new ClientNotFoundException("Client not found or you do not have permission to view it."));
        return convertToDTO(client);
    }

    @Override
    @Transactional // Ensures database integrity during write operations
    public GetClientsDTO createClient(String userId, CreateUpdateClientDTO dto) {
        Client newClient = new Client();

        // 1. Lock the client to the logged-in user
        newClient.setUserId(convertToUUID(userId));

        // 2. Map the incoming payload to the entity
        newClient.setCompanyName(dto.getCompanyName());
        newClient.setContactEmail(dto.getContactEmail());
        newClient.setBillingAddress(dto.getBillingAddress());
        newClient.setCountry(dto.getCountry());

        // 3. Save to database
        Client savedClient = clientRepo.save(newClient);

        // 4. Return the new object (now containing the DB-generated UUID)
        return convertToDTO(savedClient);
    }

    @Override
    @Transactional
    public GetClientsDTO updateClient(String clientId, String userId, CreateUpdateClientDTO dto) {
        // 1. Fetch securely (will throw exception if hacker tries to access wrong client)
        Client existingClient = clientRepo.findByIdAndUserId(convertToUUID(clientId), convertToUUID(userId))
                .orElseThrow(() -> new ClientNotFoundException("Client not found or access denied."));

        // 2. Apply updates
        existingClient.setCompanyName(dto.getCompanyName());
        existingClient.setContactEmail(dto.getContactEmail());
        existingClient.setBillingAddress(dto.getBillingAddress());
        existingClient.setCountry(dto.getCountry());

        // 3. Save and return
        Client updatedClient = clientRepo.save(existingClient);
        return convertToDTO(updatedClient);
    }

    @Override
    public ClientMetricsDTO getClientMetrics(UUID userId) {
        // 1. Establish the date boundaries
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfCurrentMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        YearMonth lastMonth = currentMonth.minusMonths(1);
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfLastMonth = currentMonth.atDay(1).atStartOfDay().minusNanos(1);

        // 2. Fetch the raw counts from PostgreSQL
        // (Assuming you have countByUserId() and countByUserIdAndCreatedAtBetween() in ClientRepo)
        long totalClients = clientRepo.countByUserId(userId);
        long clientsThisMonth = clientRepo.countByUserIdAndCreatedAtBetween(userId, startOfCurrentMonth, now);
        long clientsLastMonth = clientRepo.countByUserIdAndCreatedAtBetween(userId, startOfLastMonth, endOfLastMonth);

        // 3. Package the DTO
        ClientMetricsDTO metrics = new ClientMetricsDTO();
        metrics.setTotalCustomers((int) totalClients);
        metrics.setNewCustomersThisMonth((int) clientsThisMonth);

        metrics.setNewCustomersPct(calculatePercentageOfTotal(clientsThisMonth, totalClients));
        metrics.setNewCustomersGrowth(calculateGrowth(clientsThisMonth, clientsLastMonth));

        return metrics;
    }


    // --- Helper Methods ---

    private UUID convertToUUID(String id) {
        return UUID.fromString(id);
    }

    // Assumes your DTOs have been updated to standard Java camelCase
    private GetClientsDTO convertToDTO(Client client) {
        GetClientsDTO dto = new GetClientsDTO();
        dto.setClientId(client.getId());
        dto.setUserId(client.getUserId());
        dto.setCompanyName(client.getCompanyName());
        dto.setContactEmail(client.getContactEmail());
        dto.setBillingAddress(client.getBillingAddress());
        dto.setCountry(client.getCountry());
        dto.setCreatedAt(client.getCreatedAt());
        return dto;
    }

    /**
     * Calculates the acceleration of acquisition vs last month.
     * Formula: ((Current - Prior) / Prior) * 100
     */
    private BigDecimal calculateGrowth(long current, long prior) {
        if (prior == 0) {
            // If they had 0 last month and got some this month, it's 100% growth
            return current > 0 ? new BigDecimal("100.00") : BigDecimal.ZERO;
        }

        double growth = ((double) (current - prior) / prior) * 100;
        return BigDecimal.valueOf(growth).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculates what percentage of the total base is new this month.
     * Formula: (Part / Total) * 100
     */
    private BigDecimal calculatePercentageOfTotal(long part, long total) {
        if (total == 0) {
            return BigDecimal.ZERO;
        }
        double percentage = ((double) part / total) * 100;
        return BigDecimal.valueOf(percentage).setScale(2, RoundingMode.HALF_UP);
    }
}