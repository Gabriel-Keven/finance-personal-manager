# ESTÁGIO 1: Construção (Baixa dependências e compila o Java)
FROM maven:3.9-eclipse-temurin-25-alpine AS build
WORKDIR /app

# Copia o arquivo de dependências e baixa (faz cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código e compila a aplicação ignorando os testes
COPY src ./src
RUN mvn package -DskipTests

# ESTÁGIO 2: Execução (Cria um contêiner leve só com o que precisa rodar)
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copia apenas as pastas otimizadas geradas pelo Quarkus
COPY --from=build /app/target/quarkus-app/lib/ /app/lib/
COPY --from=build /app/target/quarkus-app/*.jar /app/
COPY --from=build /app/target/quarkus-app/app/ /app/app/
COPY --from=build /app/target/quarkus-app/quarkus/ /app/quarkus/

# Expõe a porta do Quarkus
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["java", "-jar", "quarkus-run.jar"]
