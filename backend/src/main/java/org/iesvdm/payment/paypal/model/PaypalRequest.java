package org.iesvdm.payment.paypal.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
public class PaypalRequest {

    private String method;
    private BigDecimal amount;
    private String currency;
    private String description;

}