"use strict";

var path = require("path"),

    Service = require("node-windows").Service,
    action  = process.argv[2] || "install",
    service, start;

// Create a new service object
service = new Service({
    name        : "feed-proxy",
    description : "Proxy to rewrite RSS feeds to something more usable",
    script      : path.resolve(__dirname, "./index.js")
});

start = service.start.bind(service);

if(action == "uninstall") {
    service.on("uninstall", function() {
        console.log("Uninstalled '%s' service", service.name);
    });
    
    service.uninstall();
} else {
    service.on("install", start);
    service.on("alreadyinstalled", start);

    service.install();
}
