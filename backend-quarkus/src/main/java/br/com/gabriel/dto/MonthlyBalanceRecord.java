package br.com.gabriel.dto;

import java.math.BigDecimal;

public record MonthlyBalanceRecord(
    Integer month,
    Integer year,
    BigDecimal totalIncomes,
    BigDecimal totalExpenses,
    BigDecimal finalBalance,
    String status

) {

}
