package com.accord.backend.controller;

import com.accord.backend.dto.CreateProjectDTO;
import com.accord.backend.dto.ProjectResponseDTO;
import com.accord.backend.enums.ProjectStatus;
import com.accord.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectResponseDTO>> getAllProjects(
            @RequestAttribute("userId") String userId,
            Pageable pageable) {

        return ResponseEntity.ok(projectService.getAllProjects(userId, pageable));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(
            @PathVariable String projectId,
            @RequestAttribute("userId") String userId) {

        return ResponseEntity.ok(projectService.getProjectById(projectId, userId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
            @RequestAttribute("userId") String userId,
            @RequestBody CreateProjectDTO dto) {

        ProjectResponseDTO createdProject = projectService.createProject(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{projectId}/complete")
    public ResponseEntity<ProjectResponseDTO> markProjectCompleted(
            @PathVariable String projectId,
            @RequestAttribute("userId") String userId) {

        // Updates the project status to COMPLETED
        ProjectResponseDTO updatedProject = projectService.updateProjectStatus(projectId, userId, ProjectStatus.COMPLETED);
        return ResponseEntity.ok(updatedProject);
    }
}