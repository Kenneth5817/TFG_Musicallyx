package org.iesvdm.payment.card.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class CardRequest {
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private Double amount;
    private String currency;
}
