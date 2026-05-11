package br.com.gabriel.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "incomes")
public class Incomes extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(readOnly = true, description = "Gerado automaticamente pelo banco")
    public Long idIncomes;

    @NotBlank(message = "O nome do ganho é obrigatório")
    @Column(nullable = false)
    public String name;
    
    @Positive(message = "O valor deve ser positivo.")
    @NotNull(message = "O valor é obrigatório.")
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal value;

    @NotNull(message = "A data do ganho é obrigatória.")
    @Column(nullable = false)
    public LocalDate dateReceived;

    public String description;
}
