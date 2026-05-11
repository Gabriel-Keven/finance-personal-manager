package br.com.gabriel.service;

import java.math.BigDecimal;
import java.util.List;

import br.com.gabriel.entity.Expenses;
import br.com.gabriel.repository.ExpensesRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ExpensesService {

    @Inject
    ExpensesRepository expensesRepository;
    
    public BigDecimal calculateTotalExpenses(Integer year, Integer month){
         List<Expenses> expensesFiltred = expensesRepository.searchExpenseForMonthAndYear(year, month);

        BigDecimal totalExpenses = BigDecimal.ZERO;
        for(Expenses e : expensesFiltred) {
            totalExpenses = totalExpenses.add(e.value);
        }
        
        return totalExpenses;
    }

}
