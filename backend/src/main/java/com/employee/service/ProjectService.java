package com.employee.service;

import com.employee.dto.ProjectResponse;
import com.employee.entity.Project;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));
        return ProjectResponse.fromEntity(project);
    }

    public List<ProjectResponse> getProjectsByOwnerId(String ownerId) {
        return projectRepository.findByOwnerId(ownerId).stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ProjectResponse createProject(Project project) {
        Project saved = projectRepository.save(project);
        return ProjectResponse.fromEntity(saved);
    }

    public ProjectResponse updateProject(String id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));

        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStatus(projectDetails.getStatus());

        Project updated = projectRepository.save(project);
        return ProjectResponse.fromEntity(updated);
    }

    public void deleteProject(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));
        projectRepository.delete(project);
    }
}
