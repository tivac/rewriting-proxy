var proxy   = require("express-http-proxy"),
    
    config = require("./config.json"),
    regex  = new RegExp(config.find, "gm"),
    app    = require("express")();

app.get("/*", proxy(config.host, {
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    },
    
    intercept : function(rsp, data, req, res, callback) {
        callback(null, data.toString().replace(regex, config.replace))
    },
    
    decorateRequest : function(req) {
        req.headers["Cookie"] = config.cookie;
    }
}));

app.listen(config.port, function() {
    console.log("Server listening on port %s", config.port);
});
