package com.copio.copio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.copio.copio.entity.GroupPage;

@Repository
public interface GroupPageRepository extends JpaRepository<GroupPage,Integer> {
}
