package org.iesvdm.payment.card.config;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@Getter
@Setter
@ConfigurationProperties(prefix = "stripe")
public class CardConfig {
    private String secretKey;
    private String publicKey;
}
