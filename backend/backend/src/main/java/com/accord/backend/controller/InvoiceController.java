package com.accord.backend.controller;

import com.accord.backend.dto.CreateInvoiceDTO;
import com.accord.backend.dto.InvoiceResponseDTO;
import com.accord.backend.enums.InvoiceStatus;
import com.accord.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    /**
     * Fetch a paginated list of all invoices belonging to the authenticated agency.
     */
    @GetMapping
    public ResponseEntity<Page<InvoiceResponseDTO>> getAllInvoices(
            @RequestAttribute("userId") String userId,
            Pageable pageable) {

        Page<InvoiceResponseDTO> invoices = invoiceService.getAllInvoices(userId, pageable);
        return ResponseEntity.ok(invoices);
    }

    /**
     * Fetch the details of a single invoice securely.
     */
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(
            @PathVariable String invoiceId,
            @RequestAttribute("userId") String userId) {

        InvoiceResponseDTO invoice = invoiceService.getInvoiceById(invoiceId, userId);
        return ResponseEntity.ok(invoice);
    }

    /**
     * Generate a new draft invoice.
     */
    @PostMapping
    public ResponseEntity<InvoiceResponseDTO> createInvoice(
            @RequestAttribute("userId") String userId,
            @RequestBody CreateInvoiceDTO dto) {

        InvoiceResponseDTO createdInvoice = invoiceService.createInvoice(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvoice);
    }


    /**
     * Transition an invoice from DRAFT to SENT and fire the email.
     */
    @PostMapping("/{invoiceId}/send")
    public ResponseEntity<InvoiceResponseDTO> sendInvoice(
            @PathVariable String invoiceId,
            @RequestAttribute("userId") String userId) {

        // CHANGE THIS LINE: It was calling updateInvoiceStatus
        InvoiceResponseDTO updatedInvoice = invoiceService.sendInvoiceToClient(invoiceId, userId);

        return ResponseEntity.ok(updatedInvoice);
    }

    /**
     * Delete an invoice (if it hasn't been paid yet).
     */
    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<Void> deleteInvoice(
            @PathVariable String invoiceId,
            @RequestAttribute("userId") String userId) {

        invoiceService.deleteInvoice(invoiceId, userId);
        return ResponseEntity.noContent().build(); // Returns a clean 204 No Content
    }

    @GetMapping("/{invoiceId}/download")
    public ResponseEntity<byte[]> downloadInvoicePdf(
            @PathVariable String invoiceId,
            @RequestAttribute("userId") String userId) {

        byte[] pdfBytes = invoiceService.downloadInvoicePdf(invoiceId, userId);

        // Set up the HTTP headers so the client knows a file is incoming
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        // This tells the browser to download the file rather than just displaying it,
        // and sets the default file name.
        headers.setContentDispositionFormData("attachment", "Invoice_" + invoiceId + ".pdf");

        // Disable caching so if the user updates the invoice and re-downloads, they get the fresh version
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}