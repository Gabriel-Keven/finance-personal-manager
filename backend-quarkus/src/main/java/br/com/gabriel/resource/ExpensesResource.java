package br.com.gabriel.resource;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import br.com.gabriel.entity.Expenses;
import br.com.gabriel.service.ExpensesService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/expenses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExpensesResource {

    @Inject
    ExpensesService expensesService;

    @GET
    public List<Expenses> listAll(){
        return Expenses.listAll();
    }
    
    @POST
    @Valid
    public Response add (Expenses expense){
        Expenses savedExpense = expensesService.addExpense(expense);
        return Response.status(Response.Status.CREATED).entity(savedExpense).build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public Response update (@PathParam("id") Long id, @Valid Expenses data){
        Expenses expense = Expenses.findById(id);
        if(expense == null ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        expense.name = data.name;
        expense.description = data.description;
        expense.value = data.value;
        expense.datePurchase = data.datePurchase;
        expense.hourPurchase = data.hourPurchase;
        expense.paid = data.paid;
        expense.monthly = data.monthly;
        expense.installment = data.installment;
        expense.numberInstallments = data.numberInstallments;
        expense.valueInstallments = data.valueInstallments;
        expense.topic = data.topic;
        expense.paymentType = data.paymentType;

        return Response.status(Response.Status.OK).entity(expense).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete (@PathParam("id") Long id){
        boolean deletedExpense = Expenses.deleteById(id);
        if(deletedExpense == false ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/{year}/{month}")
    public List<Expenses> listByPeriod(@PathParam("year") Integer year, @PathParam("month") Integer month) {
        return expensesService.getExpensesByMonthAndYear(year, month);
    }

    @POST
    @Path("/clone/{year}/{month}")
    @Transactional
    public Response cloneFixedExpenses(@PathParam("year") int year, @PathParam("month") int month) {
        
        int prevYear = year;
        int prevMonth = month - 1;
        
        if (prevMonth == 0) {
            prevMonth = 12;
            prevYear--;
        }

        List<Expenses> despesasAnteriores = Expenses.find(
            "YEAR(datePurchase) = ?1 AND MONTH(datePurchase) = ?2 AND monthly = true", 
            prevYear, prevMonth
        ).list();

        if (despesasAnteriores.isEmpty()) {
            return Response.ok("Nenhuma despesa fixa encontrada no mês anterior.").build();
        }

        // 3. Clona e salva as novas despesas
        for (Expenses despesaAntiga : despesasAnteriores) {
            Expenses novaDespesa = new Expenses();
            
            // Copia os dados essenciais
            novaDespesa.name = despesaAntiga.name;
            novaDespesa.value = despesaAntiga.value;
            novaDespesa.topic = despesaAntiga.topic;
            novaDespesa.hourPurchase = despesaAntiga.hourPurchase;
            novaDespesa.monthly = true; 
            novaDespesa.installment = false; 
            novaDespesa.paid = false; 

            // Se o mês passado tinha 31 dias e o atual tem 30, o Math.min ajusta automaticamente.
            LocalDate dataOriginal = despesaAntiga.datePurchase;
            int diaVencimento = Math.min(dataOriginal.getDayOfMonth(), YearMonth.of(year, month).lengthOfMonth());
            
            novaDespesa.datePurchase = LocalDate.of(year, month, diaVencimento);

            novaDespesa.persist();
        }

        return Response.status(Response.Status.CREATED).build();
    }

}