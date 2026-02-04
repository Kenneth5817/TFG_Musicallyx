package org.iesvdm.payment.card.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.iesvdm.payment.card.config.CardConfig;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CardService {

    private final CardConfig cardConfig;

    public CardService(CardConfig stripeConfig) {
        this.cardConfig = stripeConfig;
        Stripe.apiKey = stripeConfig.getSecretKey();
    }

    public static PaymentIntent createPayment(Double amount, String currency) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", (int)(amount * 100)); // En céntimos
        params.put("currency", currency.toLowerCase());
        params.put("payment_method_types", java.util.List.of("card"));
        return PaymentIntent.create(params);
    }
}
