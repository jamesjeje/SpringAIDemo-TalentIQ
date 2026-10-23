package com.fdmgroup.Spring_AI_Demo.mcp;

import com.fdmgroup.Spring_AI_Demo.service.DocumentReaderService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
@Component
public class DocumentTools {

    private final DocumentReaderService documentReaderService;

    public DocumentTools(DocumentReaderService documentReaderService) {
        this.documentReaderService = documentReaderService;
    }

    @Tool(
            name = "read_document",
            description = "Extract text from a PDF resume"
    )
    public String readDocument(MultipartFile file) {

        System.out.println("MCP TOOL: read_document invoked");
        return documentReaderService.extractText(file);
    }
}
