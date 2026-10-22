package com.fdmgroup.Spring_AI_Demo.model;

import java.util.List;

public record CandidateMetadata(
        String candidateName,
        String currentRole,
        List<String> skills,
        String summary
) {}
