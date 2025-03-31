package com.copio.copio.entity;

import java.util.List;
import jakarta.persistence.ForeignKey;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

@Entity
@Data
@Table(name = "group_pages", schema = "app")
public class GroupPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Questo genera automaticamente l'ID
    private Integer id;

    private String title;

    // Relazione uno a molti con Page
    @OneToMany(mappedBy = "groupPage", orphanRemoval = true) // MappedBy è il nome del campo nella classe Page
    @JsonManagedReference("group-page-page")
    private List<Page> pages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "grouppage_fk_user"))
    @JsonBackReference("group-page-user")
    private UserEntity user;

}
