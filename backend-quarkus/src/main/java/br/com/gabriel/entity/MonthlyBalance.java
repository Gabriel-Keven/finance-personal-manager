package br.com.gabriel.entity;

import java.math.BigDecimal;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "monthly_balance")
public class MonthlyBalance extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(readOnly = true, description = "Gerado automaticamente pelo banco")
    public Long idMonthlyBalance;

    @Column(nullable = false)
    public Integer month; // 1 a 12
    
    @Column(nullable = false)
    public Integer year;

    @Positive(message = "O total recebido deve ser positivo.")
    @Column(nullable = false)
    public BigDecimal totalIncomes;
    

    @PositiveOrZero(message = "O valor da despesa é positivo ou nulo.")
    @Column(nullable = false)
    public BigDecimal totalExpenses;

    @Column(nullable = false)
    public BigDecimal finalBalance; // totalIncomes - totalExpenses

    @Column(nullable = false)
    public String status; // "POSITIVO" ou "NEGATIVO"

}
