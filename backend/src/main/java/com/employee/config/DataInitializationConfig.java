package com.employee.config;

import com.employee.entity.Project;
import com.employee.entity.Task;
import com.employee.entity.User;
import com.employee.entity.Workflow;
import com.employee.repository.ProjectRepository;
import com.employee.repository.TaskRepository;
import com.employee.repository.UserRepository;
import com.employee.repository.WorkflowRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializationConfig {

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            WorkflowRepository workflowRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Initialize Users
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .name("Priya Sharma")
                        .email("admin@corp.com")
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(User.Role.ADMIN)
                        .team("Leadership")
                        .build();

                User manager = User.builder()
                        .name("Amit Patel")
                        .email("manager@corp.com")
                        .password(passwordEncoder.encode("Manager123!"))
                        .role(User.Role.MANAGER)
                        .team("Product")
                        .build();

                User employee = User.builder()
                        .name("Neha Rao")
                        .email("employee@corp.com")
                        .password(passwordEncoder.encode("Employee123!"))
                        .role(User.Role.EMPLOYEE)
                        .team("Engineering")
                        .build();

                userRepository.save(admin);
                userRepository.save(manager);
                userRepository.save(employee);

                // Initialize Projects
                Project project1 = Project.builder()
                        .name("Employee Portal")
                        .description("Modernize internal task tracking and sprint reporting.")
                        .ownerId(manager.getId())
                        .status(Project.Status.ACTIVE)
                        .build();

                Project project2 = Project.builder()
                        .name("Workflow Engine")
                        .description("Build workflow automation for sprint approvals.")
                        .ownerId(manager.getId())
                        .status(Project.Status.PLANNED)
                        .build();

                projectRepository.save(project1);
                projectRepository.save(project2);

                // Initialize Tasks
                Task task1 = Task.builder()
                        .title("Define backlog items")
                        .description("Collect requirements and refine stories for sprint 12.")
                        .projectId(project1.getId())
                        .assigneeId(employee.getId())
                        .status(Task.Status.IN_PROGRESS)
                        .priority(Task.Priority.HIGH)
                        .build();

                Task task2 = Task.builder()
                        .title("Deploy staging pipeline")
                        .description("Add CI/CD workflow for backend services.")
                        .projectId(project1.getId())
                        .assigneeId(manager.getId())
                        .status(Task.Status.BACKLOG)
                        .priority(Task.Priority.MEDIUM)
                        .build();

                taskRepository.save(task1);
                taskRepository.save(task2);

                // Initialize Workflows
                Workflow workflow1 = Workflow.builder()
                        .name("Sprint Planning")
                        .description("Plan tasks and allocate resources.")
                        .phase(Workflow.Phase.SPRINT)
                        .projectId(project1.getId())
                        .build();

                Workflow workflow2 = Workflow.builder()
                        .name("Review Gate")
                        .description("Collect stakeholder feedback before rollout.")
                        .phase(Workflow.Phase.REVIEW)
                        .projectId(project1.getId())
                        .build();

                workflowRepository.save(workflow1);
                workflowRepository.save(workflow2);
            }
        };
    }
}
