package br.com.gabriel.resource;

import br.com.gabriel.entity.Users;
import io.smallrye.jwt.build.Jwt;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @POST
    @Path("/login")
    public Response login(Users credentials) {
        
        // 1. Busca o usuário no banco pelo e-mail digitado
        Users user = Users.findByEmail(credentials.email);

        // 2. Verifica se o usuário existe e se a senha bate
        // (Nota de arquitetura: em um sistema real de grande porte, a senha estaria criptografada, 
        // mas para o nosso primeiro deploy, faremos a validação direta)
        if (user != null && user.password.equals(credentials.password)) {
            
            // 3. Fabrica o "Crachá" (Token JWT) com validade e assina digitalmente
            String token = Jwt.issuer("https://sistemafinanceiro.com")
                    .upn(user.email)
                    .claim("name", user.name)
                    .expiresIn(3600) // O token vale por 1 hora (3600 segundos)
                    .sign();
            
            // 4. Devolve o token empacotado em um JSON
            return Response.ok(new TokenResponse(token)).build();
        }

        // Se a senha estiver errada, devolve erro 401 (Não Autorizado)
        return Response.status(Response.Status.UNAUTHORIZED).entity("E-mail ou senha incorretos").build();
    }

    // Classe auxiliar apenas para formatar a resposta do JSON bonitinha para o Angular
    public static class TokenResponse {
        public String token;
        public TokenResponse(String token) {
            this.token = token;
        }
    }
}