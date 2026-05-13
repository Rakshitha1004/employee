package com.employee.dto;

import com.employee.entity.Workflow;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowResponse {
    private String id;
    private String name;
    private String description;
    private String phase;
    private String projectId;

    public static WorkflowResponse fromEntity(Workflow workflow) {
        return WorkflowResponse.builder()
                .id(workflow.getId())
                .name(workflow.getName())
                .description(workflow.getDescription())
                .phase(workflow.getPhase().toString())
                .projectId(workflow.getProjectId())
                .build();
    }
}
