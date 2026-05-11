package br.com.gabriel.repository;

import java.time.LocalDate;
import java.util.List;

import br.com.gabriel.entity.Expenses;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ExpensesRepository implements PanacheRepository<Expenses> {
    
    public List<Expenses> searchExpenseForMonthAndYear (Integer year, Integer month){

        LocalDate start = LocalDate.of(year,month,1); //Created initial date
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth()); //This month starts with the lenght of the month

        List<Expenses> expensesYearMonth = 
        Expenses.find("datePurchase >= ?1 AND datePurchase <=?2", start, end).list();
        return expensesYearMonth;
    }

}
