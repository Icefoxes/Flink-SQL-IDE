package com.spyduck.websocket.model;

public class ChannelConfig {
    // REQUEST
    public static final String REQUEST_EXECUTE = "/execute";

    public static final String REQUEST_CATALOG = "/catalog";

    public static final String REQUEST_EXPLAIN = "/explain";

    public static final String REQUEST_CLOSE = "/close";

    // RESPONSE
    public static final String RESPONSE_CONSOLE = "/queue/console";

    public static final String RESPONSE_NOTIFICATION = "/queue/notification";

    public static final String RESPONSE_EXPLAIN = "/queue/explain";

    public static final String RESPONSE_CATALOG = "/queue/catalog";
}
