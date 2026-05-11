package br.com.gabriel.entity;

import java.math.BigDecimal;
import java.time.LocalTime;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDate;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "expenses")
public class Expenses extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(readOnly = true, description = "Gerado automaticamente pelo banco")
    public Long idExpenses;
    
    @NotBlank(message = "O nome da despesa é obrigatório")
    @Column(nullable = false)
    public String name;
    
    public String description;
    
    @Positive(message = "O valor deve ser positivo.")
    @NotNull(message = "O valor é obrigatório.")
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal value;

    @NotNull(message = "A data da compra deve ser obrigaória.")
    @PastOrPresent(message = "A data da compra não pode ser no futuro")
    @Column(nullable = false)
    public LocalDate datePurchase;

    @NotNull(message = "A hora da compra deve ser obrigaória.")
    @Column(nullable = false)
    public LocalTime hourPurchase;

    @Column(nullable = false)
    public boolean paid;

    @Column(nullable = false)
    public boolean monthly;

    @Column(nullable = false)
    public boolean installment;
    
    @Positive(message = "O número de parcelas não pode ser negativo.")
    public Integer numberInstallments;

    @Column(precision = 10, scale = 2)
    public BigDecimal valueInstallments;

    @ManyToOne
    @JoinColumn(name = "topic")
    public Topics topic;

    @ManyToOne
    @JoinColumn(name = "typePayment")
    public TypePayments paymentType;

}
