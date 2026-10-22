package com.fdmgroup.Spring_AI_Demo.Controller;

import com.fdmgroup.Spring_AI_Demo.dto.SearchRequestDto;
import com.fdmgroup.Spring_AI_Demo.service.CandidateSearchService;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/candidates")
public class CandidateSearchController {

    private final CandidateSearchService searchService;

    public CandidateSearchController(
            CandidateSearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping("/search")
    public String search(
            @RequestBody SearchRequestDto request) {

        return searchService.search(request.getQuery());
    }
}