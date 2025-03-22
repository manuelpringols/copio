package com.copio.copio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.copio.copio.entity.GroupPage;

@Repository
public interface GroupPageRepository extends JpaRepository<GroupPage,Integer> {

     @Query("SELECT gp.name FROM GroupPage gp WHERE gp.id = :groupId")
    Optional<String> findGroupNameById(@Param("groupId") Integer groupId);
}
