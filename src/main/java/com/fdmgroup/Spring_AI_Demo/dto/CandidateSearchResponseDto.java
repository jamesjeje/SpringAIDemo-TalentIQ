package com.fdmgroup.Spring_AI_Demo.dto;

import java.util.List;

public record CandidateSearchResponseDto(
        String candidateName,
        String matchScore,
        String matchLevel,
        List<String> skills,
        List<String> strengths,
        List<String> gaps,
        String recommendation
) {}
