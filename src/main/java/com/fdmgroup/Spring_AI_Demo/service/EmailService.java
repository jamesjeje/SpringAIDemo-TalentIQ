package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(
            String recipient,
            String subject,
            String body) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(body);

        System.out.println("Sending email...");
        System.out.println("Recipient: " + recipient);
        try {
            mailSender.send(message);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Email sending failed", e);
        }


        System.out.println(
                "EMAIL SENT TO: " + recipient);
    }
}