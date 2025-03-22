package com.copio.copio.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.copio.entity.Group;
import com.copio.copio.repository.GroupRepository;



@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    // Ottieni tutti i gruppi
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // Ottieni un gruppo per ID
    public Group getGroupById(Integer id) {
        Optional<Group> group = groupRepository.findById(id);
        return group.orElse(null);
    }

    // Crea un nuovo gruppo
    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    // Aggiorna un gruppo esistente
    public Group updateGroup(Integer id, Group group) {
        if (groupRepository.existsById(id)) {
            group.setIdGroup(id);
            return groupRepository.save(group);
        }
        return null;
    }

    // Elimina un gruppo
    public boolean deleteGroup(Integer id) {
        if (groupRepository.existsById(id)) {
            groupRepository.deleteById(id);
            return true;
        }
        return false;
    }
}