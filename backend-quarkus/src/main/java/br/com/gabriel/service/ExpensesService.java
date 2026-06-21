package br.com.gabriel.service;

import java.math.BigDecimal;
import java.util.List;

import br.com.gabriel.entity.Expenses;
import br.com.gabriel.repository.ExpensesRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

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

   @Transactional
    public Expenses addExpense(Expenses originalExpense) {
        
        if (Boolean.TRUE.equals(originalExpense.installment) 
            && originalExpense.numberInstallments != null 
            && originalExpense.numberInstallments > 1) {
            
            for (int i = 0; i < originalExpense.numberInstallments; i++) {
                
                Expenses part = new Expenses();
                
                part.name = originalExpense.name + " (" + (i + 1) + "/" + originalExpense.numberInstallments + ")";
                
                // A CORREÇÃO DE ARQUITETURA AQUI:
                // O valor que vai impactar o balanço do mês é o valor da parcela!
                part.value = originalExpense.valueInstallments; 
                
                part.description = originalExpense.description;
                part.hourPurchase = originalExpense.hourPurchase;
                part.monthly = originalExpense.monthly;
                part.installment = originalExpense.installment;
                part.numberInstallments = originalExpense.numberInstallments;
                part.valueInstallments = originalExpense.valueInstallments;
                part.topic = originalExpense.topic;
                part.paymentType = originalExpense.paymentType;

                part.paid = (i == 0) ? originalExpense.paid : false;
                part.datePurchase = originalExpense.datePurchase.plusMonths(i);
                
                part.persist();
            }
            return originalExpense;
            
        } else {
            originalExpense.persist();
            return originalExpense;
        }
    }
    public List<Expenses> getExpensesByMonthAndYear(Integer year, Integer month){
         return expensesRepository.searchExpenseForMonthAndYear(year, month);
    }
}