package com.copio.copio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.copio.copio.entity.GroupPage;

@Repository
public interface GroupPageRepository extends JpaRepository<GroupPage,Integer> {

    @Query(value = "SELECT title FROM app.group_pages WHERE id = :groupId", nativeQuery = true)
    Optional<String> findGroupNameById(@Param("groupId") Integer groupId);

    @Query(value = "SELECT * FROM app.group_pages WHERE user_id = :userId", nativeQuery = true)
    List<GroupPage> findByUserId(@Param("userId") Integer userId);

    void deleteByUserId(Integer userId);

    // Metodo per eliminare una GroupPage per userId e groupId
    void deleteByUserIdAndId(Integer userId, Integer groupId);

    

}

