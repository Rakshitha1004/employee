package com.employee.service;

import com.employee.dto.WorkflowResponse;
import com.employee.entity.Workflow;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.WorkflowRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkflowService {

    private final WorkflowRepository workflowRepository;

    public WorkflowService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    public List<WorkflowResponse> getAllWorkflows() {
        return workflowRepository.findAll().stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public WorkflowResponse getWorkflowById(String id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found."));
        return WorkflowResponse.fromEntity(workflow);
    }

    public List<WorkflowResponse> getWorkflowsByProjectId(String projectId) {
        return workflowRepository.findByProjectId(projectId).stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public WorkflowResponse createWorkflow(Workflow workflow) {
        Workflow saved = workflowRepository.save(workflow);
        return WorkflowResponse.fromEntity(saved);
    }

    public WorkflowResponse updateWorkflow(String id, Workflow workflowDetails) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found."));

        workflow.setName(workflowDetails.getName());
        workflow.setDescription(workflowDetails.getDescription());
        workflow.setPhase(workflowDetails.getPhase());

        Workflow updated = workflowRepository.save(workflow);
        return WorkflowResponse.fromEntity(updated);
    }

    public void deleteWorkflow(String id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found."));
        workflowRepository.delete(workflow);
    }
}
