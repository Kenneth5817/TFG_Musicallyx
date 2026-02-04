package org.iesvdm.musicallyx.dto;

import java.util.List;

public class PageDTO<T> {
    private List<T> content;
    private int totalPages;
    private int number;

    public PageDTO(List<T> content, int totalPages, int number) {
        this.content = content;
        this.totalPages = totalPages;
        this.number = number;
    }

    // getters
    public List<T> getContent() { return content; }
    public int getTotalPages() { return totalPages; }
    public int getNumber() { return number; }
}
