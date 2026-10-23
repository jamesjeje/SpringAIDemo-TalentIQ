package com.fdmgroup.Spring_AI_Demo.mcp;

import com.fdmgroup.Spring_AI_Demo.service.EmailService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class EmailTools {

    private final EmailService emailService;

    public EmailTools(EmailService emailService) {
        this.emailService = emailService;
    }

    @Tool(
            name = "send_email",
            description = "Send role-specific interview questions via email"
    )
    public String sendEmail(
            String recipient,
            String subject,
            String body) {
        System.out.println("MCP TOOL: send_email invoked");
        emailService.sendEmail(
                recipient,
                subject,
                body);

        return "Email sent";
    }
}