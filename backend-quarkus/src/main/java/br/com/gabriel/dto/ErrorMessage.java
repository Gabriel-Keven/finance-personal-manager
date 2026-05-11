package br.com.gabriel.dto;

public record ErrorMessage(
    String message,
    int code,
    String detail
) {

}
