package br.com.gabriel.resource;

import java.util.List;

import br.com.gabriel.entity.Incomes;
import br.com.gabriel.service.IncomesService;
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
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

@Path("/incomes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IncomesResource {

    @Inject
    IncomesService incomesService;

    @GET
    public List<Incomes> listAll() {
        return Incomes.listAll();
    }

    @POST
    @Valid
    @Transactional
    public Response add(Incomes income) {
        income.persist();
        return Response.status(Response.Status.CREATED).entity(income).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update (@PathParam("id") Long id, @Valid Incomes data){
        Incomes income = Incomes.findById(id);
        if(income == null ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        income.name = data.name;
        income.value = data.value;
        income.dateReceived = data.dateReceived;
        income.description = data.description;

        return Response.status(Response.Status.OK).entity(income).build();

    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete (@PathParam("id") Long id){
        boolean deletedIncome = Incomes.deleteById(id);
        if(deletedIncome == false ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/{year}/{month}")
    public List<Incomes> listByPeriod(@PathParam("year") Integer year, @PathParam("month") Integer month) {
        return incomesService.getIncomesByMonthAndYear(year, month);
    }

}
