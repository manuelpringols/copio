package com.copio.copio.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.copio.copio.entity.Group;


public interface GroupRepository extends JpaRepository<Group,Integer>  {

     // Trova tutti i gruppi per un dato userId
     List<Group> findByUserId(Long userId);

     void deleteByUserId(Long userId);


}
