package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.entity.Group;
import com.copio.repository.GroupRepository;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    // Ottieni tutti i gruppi
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // Ottieni un gruppo per ID
    public Group getGroupById(Long id) {
        Optional<Group> group = groupRepository.findById(id);
        return group.orElse(null);
    }

    // Crea un nuovo gruppo
    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    // Aggiorna un gruppo esistente
    public Group updateGroup(Long id, Group group) {
        if (groupRepository.existsById(id)) {
            group.setId(id);
            return groupRepository.save(group);
        }
        return null;
    }

    // Elimina un gruppo
    public boolean deleteGroup(Long id) {
        if (groupRepository.existsById(id)) {
            groupRepository.deleteById(id);
            return true;
        }
        return false;
    }
}