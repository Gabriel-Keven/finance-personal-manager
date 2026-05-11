package br.com.gabriel.repository;

import java.time.LocalDate;
import java.util.List;

import br.com.gabriel.entity.Incomes;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;


@ApplicationScoped
public class IncomesRepository implements PanacheRepository<Incomes> {
    
    public List<Incomes> searchIncomeForMonthAndYear(Integer year, Integer month){
        LocalDate start = LocalDate.of(year,month,1); //Created initial date
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth()); //This month starts with the lenght of the month

        List<Incomes> incomesYearMonth = 
        Incomes.find("dateReceived >= ?1 AND dateReceived <=?2", start, end).list();
        return incomesYearMonth;
    }
}
