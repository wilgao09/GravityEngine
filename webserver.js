

var http = require('http');
var fs = require('fs');

http.createServer((req,res) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, contenttype");
    res.setHeader("Access-Control-Allow-Credentials",true);

    res.writeHead(200,{"Content-Type":"text/html"});
    fs.readFile("index.html", (err, dat) => {
        if (err) res.write("error; try again?");
        else res.write(dat.toString());
    });
    res.end();
}).listen(8080);