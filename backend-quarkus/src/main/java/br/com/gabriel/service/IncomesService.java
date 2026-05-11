package br.com.gabriel.service;

import java.math.BigDecimal;
import java.util.List;

import br.com.gabriel.entity.Incomes;
import br.com.gabriel.repository.IncomesRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class IncomesService {
    
    @Inject
    IncomesRepository incomesRepository;
    
    public BigDecimal calculateTotalIncomes(Integer year, Integer month){
         List<Incomes> incomesFiltred = incomesRepository.searchIncomeForMonthAndYear(year, month);

        BigDecimal totalIncomes = BigDecimal.ZERO;
        for(Incomes e : incomesFiltred) {
            totalIncomes = totalIncomes.add(e.value);
        }
        return totalIncomes;
    }
}
