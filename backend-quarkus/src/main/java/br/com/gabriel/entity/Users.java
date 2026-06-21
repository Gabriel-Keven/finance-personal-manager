package br.com.gabriel.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Users extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long idUser;
    
    public String name;
    public String email;
    public String password;

    // Método mágico do Panache para buscar o usuário pelo e-mail
    public static Users findByEmail(String email){
        return find("email", email).firstResult();
    }
}