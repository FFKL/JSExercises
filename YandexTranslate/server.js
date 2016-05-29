var fs = require("fs"),
    http = require("http"),
    request = require("request"),
    urlutils = require("url"),
    key = "";

fs.readFile("key.txt", function(err, result) {
    if (err) {
        throw err;
    } else {
        key = result.toString();
        http.createServer(onRequest).listen(8080);
        console.log("Server has started");
    }
});

function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    var params = urlutils.parse(request.url, true);
    if (params.pathname !== "/favicon.ico") {
        translateIt(key, params.query.lang, params.query.text, function(translateResult) {
            response.write(translateResult);
            response.end();
        });
    }
}

function translateIt(key, direction, word, callback) {
    var translatorURL = "https://translate.yandex.net/api/v1.5/tr.json/translate",
        params = urlutils.parse(translatorURL, true);
    params.query = {key: key, lang: direction, text: word};
    request.get(
        urlutils.format(params),
        function (error, response, body) {
            if (error) {
                console.error(error);
            } else {
                console.log(response.statusCode);
                callback(JSON.parse(body).text[0])
            }
        }
    )
}