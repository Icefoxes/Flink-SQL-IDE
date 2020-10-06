package com.spyduck.websocket.model.catalog;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class DatabaseDto {
    private String name;

    private List<Table> tables = new ArrayList<>();

    public DatabaseDto(String name) {
        this.name = name;
    }
}
