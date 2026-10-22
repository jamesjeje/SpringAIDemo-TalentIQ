package com.fdmgroup.Spring_AI_Demo.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
@Service
public class DocumentReaderService {

    public String extractText(MultipartFile file) {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
