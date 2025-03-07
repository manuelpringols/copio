package com.copio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.copio.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long>  {

}
