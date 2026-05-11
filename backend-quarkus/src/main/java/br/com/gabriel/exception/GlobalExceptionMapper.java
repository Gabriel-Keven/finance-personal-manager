package br.com.gabriel.exception;

import br.com.gabriel.dto.ErrorMessage;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Exception exception) {
        // 1. Logamos o erro real no console de Brasília para você debugar
        LOG.error("Erro inesperado capturado: ", exception);

        // 2. Se for uma exceção que já tem status HTTP (ex: 404, 401), mantemos o original
        if (exception instanceof WebApplicationException webEx) {
            return Response.fromResponse(webEx.getResponse())
                           .entity(new ErrorMessage("Erro na requisição", webEx.getResponse().getStatus(), webEx.getMessage()))
                           .build();
        }

        // 3. Para qualquer outro erro (ex: NullPointerException), retornamos 500 amigável
        ErrorMessage error = new ErrorMessage(
            "Ocorreu um erro interno no servidor",
            500,
            "Será verificado..."
        );

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                       .entity(error)
                       .build();
    }
}