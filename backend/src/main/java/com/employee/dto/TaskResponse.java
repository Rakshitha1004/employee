package com.employee.dto;

import com.employee.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private String projectId;
    private String assigneeId;
    private String status;
    private String priority;

    public static TaskResponse fromEntity(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .projectId(task.getProjectId())
                .assigneeId(task.getAssigneeId())
                .status(task.getStatus().toString())
                .priority(task.getPriority().toString())
                .build();
    }
}
