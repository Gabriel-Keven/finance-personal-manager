package br.com.gabriel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import br.com.gabriel.dto.MonthlyBalanceRecord;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class MonthlyBalanceServiceTest {

    @Inject
    MonthlyBalanceService monthlyBalanceService;

    @InjectMock
    IncomesService incomesService;

    @InjectMock
    ExpensesService expensesService;

    @Test
    public void shouldReturnNegativeStatusWhenExpensesAreGreater() {
        // 1. "SETPOINT": Definimos o que os serviços injetados vão retornar
        Integer month = 5;
        Integer year = 2026;
        
        when(incomesService.calculateTotalIncomes(year, month))
            .thenReturn(new BigDecimal("2000.00"));
            
        when(expensesService.calculateTotalExpenses(year, month))
            .thenReturn(new BigDecimal("2500.00"));

        // 2. EXECUÇÃO: Chamamos o método que queremos testar
        MonthlyBalanceRecord result = monthlyBalanceService.calculateBalanceYearMonth(month, year);

        // 3. VERIFICAÇÃO (ASSERT): Checamos se a saída condiz com a lógica
        assertEquals(new BigDecimal("-500.00"), result.finalBalance());
        assertEquals("NEGATIVO", result.status());
    }
}