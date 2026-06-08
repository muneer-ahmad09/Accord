package com.accord.backend.service;

import com.accord.backend.dto.CreateInvoiceDTO;
import com.accord.backend.dto.InvoiceResponseDTO;
import com.accord.backend.entity.Client;
import com.accord.backend.entity.Invoice;
import com.accord.backend.entity.Project;
import com.accord.backend.entity.User;
import com.accord.backend.enums.InvoiceStatus;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.ClientRepo;
import com.accord.backend.repository.InvoiceRepo;
import com.accord.backend.repository.ProjectRepo;
import com.accord.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepo invoiceRepo;
    private final ClientRepo clientRepo;
    private final ProjectRepo projectRepo;

    private final UserRepo userRepo;
    private final PdfService pdfService;
    private final EmailService emailService;

    public Page<InvoiceResponseDTO> getAllInvoices(String userId, Pageable pageable) {
        Page<Invoice> invoices = invoiceRepo.findByUserId(convertToUUID(userId), pageable);
        return invoices.map(this::convertToDTO);
    }

    public InvoiceResponseDTO getInvoiceById(String invoiceId, String userId) {
        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found or access denied."));
        return convertToDTO(invoice);
    }

    @Transactional
    public InvoiceResponseDTO createInvoice(String userId, CreateInvoiceDTO dto) {
        UUID userUuid = convertToUUID(userId);

        // 1. Security & Validation: Verify the client belongs to this user
        Client client = clientRepo.findByIdAndUserId(convertToUUID(dto.getClientId()), userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Client ID or access denied."));

        Invoice newInvoice = new Invoice();
        newInvoice.setUserId(userUuid);
        newInvoice.setClient(client);
        newInvoice.setInvoiceNumber(dto.getInvoiceNumber());
        newInvoice.setAmount(dto.getAmount());
        newInvoice.setCurrency(dto.getCurrency().toUpperCase());
        newInvoice.setDueDate(dto.getDueDate());

        // All new invoices start as editable drafts
        newInvoice.setStatus(InvoiceStatus.DRAFT);

        // 2. Optional Project Linkage
        if (dto.getProjectId() != null && !dto.getProjectId().isBlank()) {
            Project project = projectRepo.findByIdAndAgencyId(convertToUUID(dto.getProjectId()), userUuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Project ID or access denied."));
            newInvoice.setProject(project);
        }

        Invoice savedInvoice = invoiceRepo.save(newInvoice);
        return convertToDTO(savedInvoice);
    }

    @Transactional
    public InvoiceResponseDTO updateInvoiceStatus(String invoiceId, String userId, InvoiceStatus newStatus) {
        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found or access denied."));

        // Add business logic here if needed (e.g., cannot change a PAID invoice back to DRAFT)
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Cannot alter the status of an already paid invoice.");
        }

        invoice.setStatus(newStatus);
        Invoice updatedInvoice = invoiceRepo.save(invoice);

        return convertToDTO(updatedInvoice);
    }

    @Transactional
    public void deleteInvoice(String invoiceId, String userId) {
        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found or access denied."));

        // Critical Security Check: Never delete an invoice that has money attached to it
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Cannot delete an invoice that has already been paid. Please issue a refund instead.");
        }

        invoiceRepo.delete(invoice);
    }

    public byte[] downloadInvoicePdf(String invoiceId, String userId) {
        UUID userUuid = convertToUUID(userId);

        // 1. Fetch the Invoice
        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found or access denied."));

        // 2. Fetch the Agency (the user who owns the account)
        User agency = userRepo.findById(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Agency profile not found."));

        // 3. The Client is already attached to the Invoice entity via the @ManyToOne relationship
        Client client = invoice.getClient();

        // 4. Pass the entities to your PdfService engine
        return pdfService.generateInvoicePdf(invoice, agency, client);
    }

    // Inside your InvoiceService.java class

    @Transactional
    public InvoiceResponseDTO sendInvoiceToClient(String invoiceId, String userId) {
        // REMOVE THIS LINE: UUID userUuid = convertToUUID(invoiceId);

        // Fetch the invoice
        Invoice invoice = invoiceRepo.findByIdAndUserId(convertToUUID(invoiceId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found."));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Cannot send an already paid invoice.");
        }

        // 1. Update the database state
        invoice.setStatus(InvoiceStatus.SENT);
        Invoice updatedInvoice = invoiceRepo.save(invoice);

        // 2. Fetch the required data for the email
        Client client = invoice.getClient();
        User agency = userRepo.findById(convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found."));

        // 3. Generate the PDF byte array
        byte[] pdfBytes = pdfService.generateInvoicePdf(invoice, agency, client);

        // 4. Construct the checkout URL
        String checkoutUrl = "https://checkout.accord.com/pay/" + invoice.getId().toString();

        // 5. Fire the email
        emailService.sendInvoiceEmail(
                client.getContactEmail(),
                client.getCompanyName(), // Or getContactName() depending on what you prefer in the email body
                agency.getAgencyName(),
                checkoutUrl,
                pdfBytes,
                invoice.getInvoiceNumber()
        );

        return convertToDTO(updatedInvoice);
    }
    // --- Helper Methods ---

    private UUID convertToUUID(String id) {
        return UUID.fromString(id);
    }

    private InvoiceResponseDTO convertToDTO(Invoice invoice) {
        InvoiceResponseDTO dto = new InvoiceResponseDTO();
        dto.setId(invoice.getId());
        dto.setClientId(invoice.getClient().getId());

        if (invoice.getProject() != null) {
            dto.setProjectId(invoice.getProject().getId());
        }

        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setAmount(invoice.getAmount());
        dto.setCurrency(invoice.getCurrency());
        dto.setStatus(invoice.getStatus());
        dto.setStripePaymentIntent(invoice.getStripePaymentIntent());
        dto.setDueDate(invoice.getDueDate());
        dto.setCreatedAt(invoice.getCreatedAt());

        return dto;
    }
}