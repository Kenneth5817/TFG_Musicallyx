package org.iesvdm.musicallyx.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.text.Normalizer;

@Converter(autoApply = true)
public class DiaSemanaConverter implements AttributeConverter<DiaSemana, String> {

    @Override
    public String convertToDatabaseColumn(DiaSemana attribute) {
        if (attribute == null) return null;
        return attribute.name(); // guarda como LUNES, MARTES, etc.
    }


    @Override
    public DiaSemana convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;

        // Quita tildes y pasa a mayúsculas
        String dbNormalized = Normalizer.normalize(dbData, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase();

        for (DiaSemana d : DiaSemana.values()) {
            if (d.name().equals(dbNormalized)) {
                return d;
            }
        }

        throw new IllegalArgumentException("Valor inválido para DiaSemana: " + dbData);
    }

}
