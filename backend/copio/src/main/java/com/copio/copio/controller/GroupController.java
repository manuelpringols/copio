package com.copio.copio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.copio.copio.entity.Group;
import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.service.GroupService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserRepository userRepository;

    // GET: Ottieni tutti i gruppi
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        logger.info("Request received to get all groups");
        List<Group> groups = groupService.getAllGroups();
        if (groups.isEmpty()) {
            logger.warn("No groups found");
        } else {
            logger.info("Found {} groups", groups.size());
        }
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    // GET: Ottieni un gruppo per ID
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Integer id) {
        logger.info("Request received to get group with ID: {}", id);
        Group group = groupService.getGroupById(id);
        if (group != null) {
            logger.info("Group with ID {} found", id);
            return new ResponseEntity<>(group, HttpStatus.OK);
        }
        logger.warn("Group with ID {} not found", id);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Endpoint per creare un nuovo gruppo
   /*  @PostMapping("/save")
    public ResponseEntity<Group> createGroup(@RequestParam String groupName) {
        logger.info("Request received to create a new group with name: {}", groupName);
        try {
            Group savedGroup = new Group();  // Salva il gruppo nel database
            savedGroup.setName(groupName);
            groupService.createGroup(savedGroup);
            logger.info("Group created successfully with name: {}", groupName);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup); // Risposta con il gruppo creato
        } catch (Exception e) {
            logger.error("Error occurred while creating group with name {}: {}", groupName, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Gestisce gli errori
        }
    }
        */

        @PostMapping("/save")
public ResponseEntity<Group> createGroup(@RequestParam String groupName, @RequestParam Integer userId) {
    logger.info("Request received to create a new group with name: {} for userId: {}", groupName, userId);
    try {
        UserEntity  user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Group savedGroup = new Group();
        savedGroup.setName(groupName);
        savedGroup.setUser(user); // Associa il gruppo all'utente

        groupService.createGroup(savedGroup);
        logger.info("Group created successfully with name: {} for userId: {}", groupName, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup);
    } catch (Exception e) {
        logger.error("Error occurred while creating group with name {} for userId {}: {}", groupName, userId, e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}

    // PUT: Aggiorna un gruppo esistente
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Integer id, @RequestBody Group group) {
        logger.info("Request received to update group with ID: {}", id);
        Group updatedGroup = groupService.updateGroup(id, group);
        if (updatedGroup != null) {
            logger.info("Group with ID {} updated successfully", id);
            return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
        }
        logger.warn("Group with ID {} not found for update", id);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // DELETE: Elimina un gruppo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Integer id) {
        logger.info("Request received to delete group with ID: {}", id);
        boolean isDeleted = groupService.deleteGroup(id);
        if (isDeleted) {
            logger.info("Group with ID {} deleted successfully", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        logger.warn("Group with ID {} not found for deletion", id);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Metodo per ottenere tutti i gruppi per userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getGroupsByUserId(@PathVariable Long userId) {
        logger.info("Request received to get groups for userId: {}", userId);
        List<Group> groups = groupService.getGroupsByUserId(userId);
        if (groups.isEmpty()) {
            logger.warn("No groups found for userId: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nessun gruppo trovato per questo utente");
        } else {
            logger.info("Found {} groups for userId: {}", groups.size(), userId);
            return ResponseEntity.ok(groups);
        }
    }

    @DeleteMapping("/user/{userId}")
public ResponseEntity<Void> deleteGroupsByUserId(@PathVariable Long userId) {
    logger.info("Request received to delete groups for userId: {}", userId);
    try {
        groupService.deleteGroupsByUserId(userId);
        logger.info("Groups for userId {} deleted successfully", userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } catch (Exception e) {
        logger.error("Error occurred while deleting groups for userId {}: {}", userId, e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}
