package com.accord.backend.controller;

import com.accord.backend.dto.CreateProjectDTO;
import com.accord.backend.dto.ProjectCountResponseDto;
import com.accord.backend.dto.ProjectResponseDTO;
import com.accord.backend.enums.ProjectStatus;
import com.accord.backend.service.ProjectService;
import com.accord.backend.utils.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectResponseDTO>> getAllProjects(
            @AuthenticationPrincipal UserDetailsImp userDetails,
            Pageable pageable) {
        String userId = userDetails.getUser().getId().toString();
        return ResponseEntity.ok(projectService.getAllProjects(userId, pageable));
    }

    @GetMapping("/count")
    public ResponseEntity<ProjectCountResponseDto> countProjects(@AuthenticationPrincipal UserDetailsImp userDetails) {
        UUID userId = userDetails.getUser().getId();
        return ResponseEntity.ok(projectService.getProjectCount(userId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(
            @PathVariable String projectId,
            @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        return ResponseEntity.ok(projectService.getProjectById(projectId, userId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
            @AuthenticationPrincipal UserDetailsImp userDetails,
            @RequestBody CreateProjectDTO dto) {
        String userId = userDetails.getUser().getId().toString();
        ProjectResponseDTO createdProject = projectService.createProject(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{projectId}/complete")
    public ResponseEntity<ProjectResponseDTO> markProjectCompleted(
            @PathVariable String projectId,
            @AuthenticationPrincipal UserDetailsImp userDetails) {
        String userId = userDetails.getUser().getId().toString();
        // Updates the project status to COMPLETED
        ProjectResponseDTO updatedProject = projectService.updateProjectStatus(projectId, userId, ProjectStatus.COMPLETED);
        return ResponseEntity.ok(updatedProject);
    }
}