package com.fdmgroup.Spring_AI_Demo.Controller;

import com.fdmgroup.Spring_AI_Demo.service.DocumentReaderService;
import com.fdmgroup.Spring_AI_Demo.service.ResumeProcessingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeProcessingService resumeProcessingService;
    private final DocumentReaderService documentReaderService;

    public ResumeController(
            ResumeProcessingService resumeProcessingService, DocumentReaderService documentReaderService) {
        this.resumeProcessingService = resumeProcessingService;
        this.documentReaderService = documentReaderService;
    }
   //verifying resume upload
    @PostMapping("/upload")
    public String uploadResume(
            @RequestParam("file") MultipartFile file) {

        resumeProcessingService.processResume(file);

        return "Resume uploaded successfully";
    }
//Verifying data extraction.
//    @PostMapping("/upload")
//    public String uploadResume(
//            @RequestParam("file") MultipartFile file) {
//
//        return documentReaderService.extractText(file);
//    }
}