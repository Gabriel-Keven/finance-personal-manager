package br.com.gabriel.exception;

import br.com.gabriel.dto.ErrorMessage;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.stream.Collectors;

@Provider // Esta anotação "liga" o mapper no Quarkus automaticamente
public class ValidationMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        // Pega todas as mensagens de erro (ex: "O valor deve ser positivo")
        String messages = exception.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .collect(Collectors.joining(", "));

        // Cria o seu Record de erro com o status 400 (Bad Request)
        ErrorMessage error = new ErrorMessage(
            "Dados inválidos enviados para o servidor",
            404, // Você pode usar 400 ou 404 dependendo da lógica
            messages
        );

        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }
}