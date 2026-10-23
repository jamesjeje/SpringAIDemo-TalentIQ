package com.fdmgroup.Spring_AI_Demo.service;

import com.fdmgroup.Spring_AI_Demo.mcp.DocumentTools;
import com.fdmgroup.Spring_AI_Demo.model.CandidateMetadata;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeProcessingService {

    private final DocumentReaderService documentReaderService;
    private final DataCleaningService dataCleaningService;
    private final ChunkingService chunkingService;
    private final VectorStoreService vectorStoreService;
    private final MetadataExtractionService metadataExtractionService;
    private final DocumentTools documentTools;

    public ResumeProcessingService(DocumentReaderService documentReaderService, DataCleaningService dataCleaningService, ChunkingService chunkingService, VectorStoreService vectorStoreService,  MetadataExtractionService metadataExtractionService,DocumentTools documentTools) {
        this.documentReaderService = documentReaderService;
        this.dataCleaningService = dataCleaningService;
        this.chunkingService = chunkingService;
        this.vectorStoreService = vectorStoreService;
        this.metadataExtractionService = metadataExtractionService;
        this.documentTools = documentTools;
    }

    public void processResume(MultipartFile file) {
        System.out.println("STEP 1 - Read document");

        String rawText =
                documentTools.readDocument(file);

        String candidateName =
                rawText.lines()
                        .filter(line -> !line.isBlank())
                        .findFirst()
                        .orElse("Unknown Candidate");
        System.out.println("STEP 2 - Clean text");
        String cleanText =
                dataCleaningService.clean(rawText);
        System.out.println("STEP 3 - Extract metadata");
        CandidateMetadata metadata =
                metadataExtractionService.extract(cleanText);
        System.out.println("STEP 4 - Metadata extracted");

        System.out.println("STEP 5 - Chunking");
        List<String> chunks =
                chunkingService.chunk(cleanText);

        System.out.println("STEP 6 - Chunks created");
        System.out.println("STEP 7 - Vector store save");

        vectorStoreService.store(
                chunks,
                metadata,
                file.getOriginalFilename());
        System.out.println("STEP 8 - Resume processed");
    }
}