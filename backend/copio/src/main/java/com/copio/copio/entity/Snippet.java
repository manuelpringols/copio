package com.copio.copio.entity;

import org.hibernate.engine.internal.ForeignKeys;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.Data;

@Entity
@Table(name = "snippets", schema = "app")
@Data // Lombok genererà automaticamente getter, setter, toString, hashCode e equals
public class Snippet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(foreignKey = @ForeignKey(name = "snippet_fk_group"), name = "idGroup", referencedColumnName = "idGroup")
    private Group idGroup; // Riferimento al gruppo a cui appartiene lo snippet
    // Riferimento al gruppo a cui appartiene lo snippet

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "snippet_fk_user"))
    @JsonBackReference("snippet-user")
    private UserEntity user;
}
