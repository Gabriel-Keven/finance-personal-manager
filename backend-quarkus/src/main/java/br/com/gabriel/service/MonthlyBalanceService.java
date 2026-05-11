package br.com.gabriel.service;

import java.math.BigDecimal;

import br.com.gabriel.dto.MonthlyBalanceRecord;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MonthlyBalanceService {

    @Inject
    IncomesService incomesService;

    @Inject
    ExpensesService expensesService;

    public MonthlyBalanceRecord calculateBalanceYearMonth (Integer month, Integer year){

        BigDecimal totalIncomes = incomesService.calculateTotalIncomes(year, month);
        BigDecimal totalExpenses = expensesService.calculateTotalExpenses(year, month);
        BigDecimal finalBalance = totalIncomes.subtract(totalExpenses);
        String status;

        if(finalBalance.compareTo(BigDecimal.ZERO) > 0){
            status = "POSITIVO";
        }else if(finalBalance.compareTo(BigDecimal.ZERO) == 0){
            status = "NEUTRO";
        }else{
            status = "NEGATIVO";
        }

        return new MonthlyBalanceRecord(month, year, totalIncomes, totalExpenses, finalBalance, status);
    }

    

}
