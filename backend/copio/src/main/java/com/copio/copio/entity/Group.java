package com.copio.copio.entity;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.ForeignKey;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "groupy",schema = "app")

@Entity
@Data // Lombok genererà automaticamente getter, setter, toString, hashCode e equals
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idGroup;
    
    private String name;

     // Relazione OneToMany con Snippet
     @OneToMany(mappedBy = "idGroup", cascade = CascadeType.REMOVE, orphanRemoval = true)     
     @JsonBackReference("group-snippets")
     private List<Snippet> snippets;


     @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false,
                foreignKey = @ForeignKey(name = "group_fk_user"))
                @JsonBackReference("group-user")
    private UserEntity user;
   
}





