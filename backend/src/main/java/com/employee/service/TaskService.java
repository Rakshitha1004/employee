package com.employee.service;

import com.employee.dto.TaskResponse;
import com.employee.entity.Task;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        return TaskResponse.fromEntity(task);
    }

    public List<TaskResponse> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByAssigneeId(String assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(Task task) {
        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTask(String id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setAssigneeId(taskDetails.getAssigneeId());

        Task updated = taskRepository.save(task);
        return TaskResponse.fromEntity(updated);
    }

    public void deleteTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        taskRepository.delete(task);
    }
}
