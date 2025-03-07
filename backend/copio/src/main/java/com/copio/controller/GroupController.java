package com.copio.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.copio.entity.Group;
import com.service.GroupService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    // GET: Ottieni tutti i gruppi
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    // GET: Ottieni un gruppo per ID
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Group group = groupService.getGroupById(id);
        if (group != null) {
            return new ResponseEntity<>(group, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

 // Endpoint per creare un nuovo gruppo
 @PostMapping("/save")
 public ResponseEntity<Group> createGroup(@RequestBody Group group) {
     try {
         Group savedGroup = groupService.createGroup(group);  // Salva il gruppo nel database
         return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup); // Risposta con il gruppo creato
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Gestisce gli errori
     }
 }

    // PUT: Aggiorna un gruppo esistente
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody Group group) {
        Group updatedGroup = groupService.updateGroup(id, group);
        if (updatedGroup != null) {
            return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // DELETE: Elimina un gruppo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        boolean isDeleted = groupService.deleteGroup(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
