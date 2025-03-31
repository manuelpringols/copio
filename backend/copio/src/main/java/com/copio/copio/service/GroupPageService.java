package com.copio.copio.service;

import com.copio.copio.entity.GroupPage;
import com.copio.copio.repository.GroupPageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupPageService {

    
    @Autowired
     private GroupPageRepository groupPageRepository;

    
    public List<GroupPage> getAllGroupPages() {
        return groupPageRepository.findAll();
    }

    public Optional<GroupPage> getGroupPageById(Integer id) {
        return groupPageRepository.findById(id);
    }

    public GroupPage createGroupPage(GroupPage groupPage) {
        return groupPageRepository.save(groupPage);
    }

    public void deleteGroupPage(Integer id) {
        groupPageRepository.deleteById(id);
    }

    public GroupPage updateGroupPage(Integer id, GroupPage groupPage) {
        if (groupPageRepository.existsById(id)) {
            groupPage.setId(id);
            return groupPageRepository.save(groupPage);
        }
        return null;
    }


    public Optional<String> getGroupNameFromId(Integer groupId) {
        return  groupPageRepository.findGroupNameById(groupId);
    }

    public List<GroupPage> getGroupPagesByUserId(Integer userId) {
        return groupPageRepository.findByUserId(userId);  // Metodo da implementare nel repository
    }

    public void deleteGroupPagesByUserId(Integer userId) {
        groupPageRepository.deleteByUserId(userId);
    }

      // Metodo per eliminare una GroupPage per userId e groupId
      public void deleteGroupPageByUserAndGroupId(Integer userId, Integer groupId) {
        groupPageRepository.deleteByUserIdAndId(userId, groupId);
    }
    

    


   
}
