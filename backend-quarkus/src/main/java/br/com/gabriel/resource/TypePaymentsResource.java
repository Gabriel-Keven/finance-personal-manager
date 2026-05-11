package br.com.gabriel.resource;

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
import br.com.gabriel.entity.TypePayments;
import java.util.List;

@Path("/type-payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TypePaymentsResource {
    
    @GET
    public List<TypePayments> listAll(){
        return TypePayments.listAll();
    }

    @POST
    @Valid
    @Transactional
    public Response add(TypePayments typePayments){
        typePayments.persist();
        return Response.status(Response.Status.CREATED).entity(typePayments).build();
    }
    
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid TypePayments data){
        TypePayments typePayments = TypePayments.findById(id);
        if(typePayments == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        typePayments.name = data.name;
        return Response.status(Response.Status.OK).entity(typePayments).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id){
        TypePayments typePayments = TypePayments.findById(id);
        if(typePayments == null ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        boolean deleteTypePayament = TypePayments.deleteById(id);
        if(deleteTypePayament == false){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
