package br.com.gabriel.entity;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "typePayments")
public class TypePayments extends PanacheEntityBase{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(readOnly = true, description = "Gerado automaticamente pelo banco")
    public Long idTypePayments;

    @NotBlank(message = "O nome do tipo de pagamento é obrigaótio.")
    @Column(nullable = false)
    public String name;

}
