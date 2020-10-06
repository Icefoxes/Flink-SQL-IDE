package com.spyduck.websocket.service;

import com.sun.codemodel.JCodeModel;
import org.jsonschema2pojo.*;
import org.jsonschema2pojo.rules.RuleFactory;

import java.io.IOException;
import java.nio.file.Files;

public class JsonParseService {
    public class JsonColumn {
        String name;
        String type;
    }

    public void parseJson(String json) throws IOException {
        JCodeModel codeModel = new JCodeModel();
        GenerationConfig config = new DefaultGenerationConfig() {
            @Override
            public boolean isGenerateBuilders() { // set config option by overriding method
                return true;
            }
        };

        SchemaMapper mapper = new SchemaMapper(new RuleFactory(config, new Jackson2Annotator(config), new SchemaStore()), new SchemaGenerator());
        mapper.generate(codeModel, "ClassName", "com.example", json);

        codeModel.build(Files.createTempDirectory("required").toFile());
    }

    public static void main(String[] args) throws IOException {
        new JsonParseService().parseJson("{\"name\": \"Student\"}");
    }
}
