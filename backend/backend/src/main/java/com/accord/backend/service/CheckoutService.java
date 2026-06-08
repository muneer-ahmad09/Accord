package com.accord.backend.service;

import com.accord.backend.dto.PublicInvoiceDTO;
import com.accord.backend.entity.Invoice;
import com.accord.backend.entity.User;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.InvoiceRepo;
import com.accord.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final InvoiceRepo invoiceRepo;
    private final UserRepo userRepo;

    public PublicInvoiceDTO getPublicInvoiceSummary(String invoiceId) {
        // 1. Fetch the invoice using ONLY the invoice ID (since there is no logged-in user)
        Invoice invoice = invoiceRepo.findById(UUID.fromString(invoiceId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found."));

        // 2. Fetch the Agency details so the client knows who they are paying
        User agency = userRepo.findById(invoice.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found."));

        // 3. Map ONLY the safe data to the DTO
        PublicInvoiceDTO dto = new PublicInvoiceDTO();
        dto.setInvoiceId(invoice.getId().toString());
        dto.setAgencyName(agency.getAgencyName());
        dto.setClientCompanyName(invoice.getClient().getCompanyName());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setAmount(invoice.getAmount());
        dto.setCurrency(invoice.getCurrency());
        dto.setDueDate(invoice.getDueDate());
        dto.setStatus(invoice.getStatus());

        return dto;
    }
}
