var httpProxy = require("http-proxy"),
    through   = require("through2"),
    
    config = require("rc")("proxy", {
        port    : 5050,
        find    : false,
        replace : false,
        cookie  : false,
        host    : false
    }),
    
    regex = new RegExp(config.find, "gm"),
    
    proxy;

proxy = httpProxy.createProxyServer({
    target : config.host,
    changeOrigin : true
});

if(config.cookie) {
    proxy.on("proxyReq", function(proxyReq) {
        proxyReq.setHeader("Cookie", config.cookie);
    });
}

proxy.on("proxyRes", function(proxyRes, req, res) {
    proxyRes.pipe(through(function(chunk, enc, done) {
        this.push(chunk.toString().replace(regex, config.replace));
        
        return done();
    }))
    .pipe(res);
});

console.log("listening on port %s", config.port);
proxy.listen(config.port);
