package com.accord.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendInvoiceEmail(String toEmail, String clientName, String agencyName,
                                 String checkoutUrl, byte[] pdfAttachment, String invoiceNumber) {
        try {
            // MimeMessage is required for HTML and attachments
            MimeMessage message = mailSender.createMimeMessage();

            // The "true" flag indicates this is a multipart message (HTML + Attachment)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // You would normally set this to your platform's verified "From" address
            helper.setFrom("billing@accord.com");
            helper.setTo(toEmail);
            helper.setSubject("New Invoice from " + agencyName + " (" + invoiceNumber + ")");

            // Generate the HTML body
            String htmlMsg = buildHtmlTemplate(clientName, agencyName, checkoutUrl);

            // The "true" flag here tells Spring this string contains HTML, not plain text
            helper.setText(htmlMsg, true);

            // Attach the PDF array directly from RAM
            helper.addAttachment("Invoice_" + invoiceNumber + ".pdf", new ByteArrayResource(pdfAttachment));

            // Fire the email
            mailSender.send(message);
            log.info("Successfully sent invoice email to {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}", toEmail, e);
            throw new RuntimeException("Could not dispatch the email to the client.");
        }
    }

    /**
     * Builds a clean, professional HTML layout with a prominent call-to-action button.
     */
    private String buildHtmlTemplate(String clientName, String agencyName, String checkoutUrl) {
        return "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #111;'>Hello " + clientName + ",</h2>"
                + "<p>Please find attached your latest invoice from <strong>" + agencyName + "</strong>.</p>"
                + "<br/>"
                + "<div style='text-align: center; margin: 30px 0;'>"
                + "  <a href='" + checkoutUrl + "' style='background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Pay Invoice Securely</a>"
                + "</div>"
                + "<p>A PDF copy of this invoice is attached to this email for your accounting records.</p>"
                + "<br/><hr style='border: none; border-top: 1px solid #eee;'/>"
                + "<p style='font-size: 12px; color: #888;'>Powered by Accord - The professional billing platform.</p>"
                + "</div>";
    }

    public void sendOtpEmail(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Verify your Accord account");
        message.setText(
                "Your verification code is:\n\n"
                        + otp
                        + "\n\nThis code expires in 10 minutes."
        );

        mailSender.send(message);
    }
}