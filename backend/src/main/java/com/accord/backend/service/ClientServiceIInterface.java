package com.accord.backend.service;


import com.accord.backend.dto.ClientMetricsDTO;
import com.accord.backend.dto.CreateUpdateClientDTO;
import com.accord.backend.dto.GetClientsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ClientServiceIInterface {
    Page<GetClientsDTO> getAllClients(String user_id, Pageable pageable);
    GetClientsDTO getClientById(String clientId, String userId);
    GetClientsDTO createClient(String userId, CreateUpdateClientDTO dto);
    GetClientsDTO updateClient(String clientId, String userId, CreateUpdateClientDTO dto);
    ClientMetricsDTO getClientMetrics(UUID userId);

}
