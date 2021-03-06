var url = require("url"),

    proxy = require("express-http-proxy"),
    
    config  = require("./config.json"),
    regexes = config.regexes.map(function(regex) {
        regex.find = new RegExp(regex.find, "gm");
        
        return regex;
    }),
    
    app = require("express")();

app.get("/*", proxy(config.host, {
    forwardPath: function(req, res) {
        return url.parse(req.url).path;
    },
    
    intercept : function(rsp, data, req, res, callback) {
        console.log(
            "Response from %s",
            url.format({ host : rsp.req._headers.host, pathname : rsp.req.path })
        );

        data = data.toString();
        
        config.regexes.forEach(function(regex) {
            data = data.replace(regex.find, regex.replace);
        });
        
        callback(null, data);
    }
}));

app.listen(config.port, function() {
    console.log("Server listening on port %s", config.port);
});
