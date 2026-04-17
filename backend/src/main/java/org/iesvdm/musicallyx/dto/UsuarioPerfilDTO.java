package org.iesvdm.musicallyx.dto;

public class UsuarioPerfilDTO {
    private String nombre;
    private String email;
    private String telefono;
    private String nivelMusical;
    private String gustosMusicales;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getNivelMusical() { return nivelMusical; }
    public void setNivelMusical(String nivelMusical) { this.nivelMusical = nivelMusical; }
    public String getGustosMusicales() { return gustosMusicales; }
    public void setGustosMusicales(String gustosMusicales) { this.gustosMusicales = gustosMusicales; }
}