package com.accord.backend.service;

import com.accord.backend.dto.CreateProjectDTO;
import com.accord.backend.dto.ProjectCountResponseDto;
import com.accord.backend.dto.ProjectResponseDTO;
import com.accord.backend.entity.Client;
import com.accord.backend.entity.Project;
import com.accord.backend.entity.User;
import com.accord.backend.enums.ProjectStatus;
import com.accord.backend.exceptions.ResourceNotFoundException;
import com.accord.backend.repository.ClientRepo;
import com.accord.backend.repository.ProjectRepo;
import com.accord.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final ClientRepo clientRepo;
    private final UserRepo userRepo;

    public Page<ProjectResponseDTO> getAllProjects(String userId, Pageable pageable) {
        return projectRepo.findByAgencyId(convertToUUID(userId), pageable)
                .map(this::convertToDTO);
    }

    public ProjectCountResponseDto getProjectCount(UUID userId) {
        long count = projectRepo.countByStatusAndAgencyId(ProjectStatus.ACTIVE,userId);
        ProjectCountResponseDto projectCountResponseDto = new ProjectCountResponseDto();
        projectCountResponseDto.setTotalProjects(count);
        return projectCountResponseDto;
    }

    public ProjectResponseDTO getProjectById(String projectId, String userId) {
        Project project = projectRepo.findByIdAndAgencyId(convertToUUID(projectId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or access denied."));
        return convertToDTO(project);
    }

    @Transactional
    public ProjectResponseDTO createProject(String userId, CreateProjectDTO dto) {
        UUID userUuid = convertToUUID(userId);

        // Security Check: Ensure the client exists and belongs to this specific agency
        Client client = clientRepo.findByIdAndUserId(convertToUUID(dto.getClientId()), userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Client ID or access denied."));

        User agency = userRepo.findById(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found"));
        Project project = new Project();
        project.setAgency(agency);
        project.setClient(client);
        project.setName(dto.getName());

        // All new projects start as ACTIVE (using a String since you aren't using an Enum)
        project.setStatus(ProjectStatus.ACTIVE);

        Project savedProject = projectRepo.save(project);
        return convertToDTO(savedProject);
    }

    @Transactional
    public ProjectResponseDTO updateProjectStatus(String projectId, String userId, ProjectStatus newStatus) {
        Project project = projectRepo.findByIdAndAgencyId(convertToUUID(projectId), convertToUUID(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or access denied."));

        project.setStatus(newStatus);
        Project updatedProject = projectRepo.save(project);

        return convertToDTO(updatedProject);
    }

    // --- Helper Methods ---

    private UUID convertToUUID(String id) {
        return UUID.fromString(id);
    }

    private ProjectResponseDTO convertToDTO(Project project) {
        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setClientId(project.getClient().getId());
        dto.setStatus(project.getStatus());
        return dto;
    }
}