package com.spyduck.websocket.model.catalog;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class CatalogDto {
    private String name;

    private List<DatabaseDto> databases = new ArrayList<>();

    public CatalogDto(String name) {
        this.name = name;
    }
}
