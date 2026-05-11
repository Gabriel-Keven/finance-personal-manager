package br.com.gabriel.resource;

import java.util.List;

import br.com.gabriel.dto.MonthlyBalanceRecord;
import br.com.gabriel.entity.MonthlyBalance;
import br.com.gabriel.service.ExpensesService;
import br.com.gabriel.service.IncomesService;
import br.com.gabriel.service.MonthlyBalanceService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/monthly-balance")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MonthlyBalanceResource {
    
    @Inject
    MonthlyBalanceService monthlyBalanceService;

    @Inject
    ExpensesService expensesService;

    @Inject
    IncomesService incomesService;

    @GET
    public List<MonthlyBalance> listAll() {
        return MonthlyBalance.listAll();
    }

    @POST
    @Path("/{month}/{year}")
    @Transactional
    public Response add(@PathParam("month") Integer month, @PathParam("year") Integer year){
        MonthlyBalanceRecord record = monthlyBalanceService.calculateBalanceYearMonth(month, year);

        // Tenta encontrar um balanço já existente para este mês/ano em Brasília
        MonthlyBalance balance = MonthlyBalance.find("month = ?1 and year = ?2", month, year).firstResult();

        // Se não existir, aí sim criamos um novo
        if (balance == null) {
            balance = new MonthlyBalance();
            balance.month = month;
            balance.year = year;
        }

        // Falta persistir na entidade MonthlyBalance se você quiser salvar no banco
        balance.month = record.month();
        balance.year = record.year();
        balance.totalIncomes = record.totalIncomes();
        balance.totalExpenses = record.totalExpenses();
        balance.finalBalance = record.finalBalance();
        balance.status = record.status();
        balance.persist();

        return Response.status(Response.Status.CREATED).entity(record).build();

    } 
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id){
        MonthlyBalance monthlyBalance = MonthlyBalance.findById(id);
        if(monthlyBalance == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        boolean deletedMonyhlyBalanced = MonthlyBalance.deleteById(id);
        if(deletedMonyhlyBalanced == false){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();

    }
}
