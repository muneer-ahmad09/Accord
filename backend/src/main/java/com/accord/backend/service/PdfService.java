package com.accord.backend.service;

import com.accord.backend.entity.Client;
import com.accord.backend.entity.Invoice;
import com.accord.backend.entity.User;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.Color;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(Invoice invoice, User agency, Client client) {
        // We output to a byte array so we can send it directly over the internet
        // without cluttering your server's hard drive with temporary files.
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Create a standard US Letter document with reasonable margins
        Document document = new Document(PageSize.LETTER, 50, 50, 50, 50);

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // 1. Define Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

            // 2. Add The Header (Agency Name & "INVOICE")
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);

            PdfPCell agencyCell = new PdfPCell(new Phrase(agency.getAgencyName(), titleFont));
            agencyCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(agencyCell);

            PdfPCell titleCell = new PdfPCell(new Phrase("INVOICE", headerFont));
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            titleCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(titleCell);

            document.add(headerTable);
            document.add(new Paragraph("\n\n")); // Spacing

            // 3. Billing Information (Billed To vs. Invoice Details)
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);

            // Left Side: Client Info
            String clientInfo = "Billed To:\n" +
                    client.getCompanyName() + "\n" +
                    client.getBillingAddress() + "\n" +
                    client.getCountry();
            PdfPCell billedToCell = new PdfPCell(new Phrase(clientInfo, normalFont));
            billedToCell.setBorder(Rectangle.NO_BORDER);
            infoTable.addCell(billedToCell);

            // Right Side: Dates and IDs
            String invoiceDetails = "Invoice Number: " + invoice.getInvoiceNumber() + "\n" +
                    "Date of Issue: " + invoice.getCreatedAt().toLocalDate() + "\n" +
                    "Due Date: " + invoice.getDueDate();
            PdfPCell detailsCell = new PdfPCell(new Phrase(invoiceDetails, normalFont));
            detailsCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            detailsCell.setBorder(Rectangle.NO_BORDER);
            infoTable.addCell(detailsCell);

            document.add(infoTable);
            document.add(new Paragraph("\n\n"));

            // 4. The Financial Breakdown Table
            PdfPTable financialTable = new PdfPTable(2);
            financialTable.setWidthPercentage(100);
            financialTable.setWidths(new float[]{3f, 1f}); // Description is wider than Amount

            // Table Headers
            PdfPCell descHeader = new PdfPCell(new Phrase("Description", headerFont));
            descHeader.setPaddingBottom(10);
            financialTable.addCell(descHeader);

            PdfPCell amountHeader = new PdfPCell(new Phrase("Amount", headerFont));
            amountHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amountHeader.setPaddingBottom(10);
            financialTable.addCell(amountHeader);

            // Table Data (Currently assuming a single project fee for simplicity)
            PdfPCell descCell = new PdfPCell(new Phrase("Professional Services Rendered", normalFont));
            descCell.setPaddingTop(10);
            descCell.setPaddingBottom(10);
            financialTable.addCell(descCell);

            String formattedAmount = invoice.getCurrency() + " " + invoice.getAmount().toString();
            PdfPCell amtCell = new PdfPCell(new Phrase(formattedAmount, normalFont));
            amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amtCell.setPaddingTop(10);
            amtCell.setPaddingBottom(10);
            financialTable.addCell(amtCell);

            document.add(financialTable);

            // 5. Payment Instructions
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("Payment Instructions", headerFont));
            document.add(new Paragraph("Please pay securely online via the link provided in your email.", normalFont));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF document", e);
        }

        return outputStream.toByteArray();
    }
}