package com.spyduck.websocket.model.catalog;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Data
@NoArgsConstructor
public class Table {
    private String name;

    private List<Column> columns = new ArrayList<>();

    private Properties properties = new Properties();

    public Table(String name) {
        this.name = name;
    }
}
