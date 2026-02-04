package org.iesvdm.payment.card.controller;

import org.iesvdm.payment.card.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;


@RestController
@RequestMapping("/payment/card")
@CrossOrigin("http://localhost:4200")
public class CardController {

    private final CardService stripeService;

    public CardController(CardService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestParam Double amount, @RequestParam String currency) {
        try {
            PaymentIntent intent = CardService.createPayment(amount, currency);
            return ResponseEntity.ok(intent.getClientSecret());
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
