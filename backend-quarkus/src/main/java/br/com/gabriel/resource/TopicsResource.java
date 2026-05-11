package br.com.gabriel.resource;
import br.com.gabriel.entity.Topics;
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
import java.util.List;

@Path("/topics")
@Produces(MediaType.APPLICATION_JSON) //Responde JSON para o frontend
@Consumes(MediaType.APPLICATION_JSON) //Consome JSON do frontend
public class TopicsResource {

    @GET
    public List<Topics> listAll(){
        return Topics.listAll();
    }

    @POST
    @Valid
    @Transactional
    public Response add(Topics topic) {
        topic.persist();
        return Response.status(Response.Status.CREATED).entity(topic).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid Topics data){
        Topics topic = Topics.findById(id);
        if(topic == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        topic.name = data.name;
        return Response.status(Response.Status.OK).entity(topic).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id){
        Topics topic = Topics.findById(id);
        if(topic == null ){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        boolean deleteTopic = Topics.deleteById(id);
        if(deleteTopic == false){
              return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
