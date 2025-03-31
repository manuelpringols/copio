package com.copio.copio.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users", schema = "iam")
@Data
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Relazioni con altre entity
  // Relazione con Snippet
  @JsonManagedReference("snippet-user")  // Nome univoco per la relazione Snippet
  @OneToMany(mappedBy = "user",  orphanRemoval = true)
  private List<Snippet> snippets = new ArrayList<>();

  // Relazione con Group
  @JsonManagedReference("group-user")  // Nome univoco per la relazione Group
  @OneToMany(mappedBy = "user",  orphanRemoval = true)
  private List<Group> groups = new ArrayList<>();

  // Relazione con Page
  @JsonManagedReference("page-user")  // Nome univoco per la relazione Page
  @OneToMany(mappedBy = "user",  orphanRemoval = true)
  private List<Page> pages = new ArrayList<>();

  // Relazione con GroupPage
  @JsonManagedReference("group-page-user")  // Nome univoco per la relazione GroupPage
  @OneToMany(mappedBy = "user",  orphanRemoval = true)
  private List<GroupPage> groupPages = new ArrayList<>();

}
