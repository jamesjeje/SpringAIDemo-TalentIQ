package com.fdmgroup.Spring_AI_Demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PlannerOutputDto(

        List<String> focusAreas,

        @JsonProperty("key_technical_topics")
        List<TopicDto> technicalTopics,

        @JsonProperty("behavioural_topics")
        List<TopicDto> behaviouralTopics,

        @JsonProperty("experience_areas_to_probe")
        List<ExperienceProbeDto> experienceAreasToProbe

) {}