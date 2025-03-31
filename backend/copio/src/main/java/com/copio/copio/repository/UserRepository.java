package com.copio.copio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.copio.copio.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);


    boolean existsByEmail(String email);  // Aggiungi questo metodo per verificare l'esistenza dell'email
    boolean existsByUsername(String username);  //



}
