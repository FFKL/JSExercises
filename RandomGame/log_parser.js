var fs = require("fs"),
    sugar = require("sugar");

fs.readFile("game_log.txt", function(err, result) {
    if (err) {
        throw err;
    } else {
        var res = result.toString().lines().remove("");
        countGamesRes(res);
    }
});

function countGamesRes(res) {
    var win = 0,
        lost = 0,
        gamesCount = res.length;
    for (var i = 0; i < gamesCount; i++) {
        var results = res[i];
        if (results[0] === results[2]) {
            win++;
        } else {
            lost++;
        }
    }
    var winPercent = (win * 100) / gamesCount;
    var lostPercent = 100 - winPercent;
    console.log("Всего игр сыграно: " + gamesCount + "\n" +
                "Победы: " + win + "\n" +
                "Поражения: " + lost + "\n" +
                "Процент побед: " + winPercent + "\n" +
                "Процент поражений: " + lostPercent + "\n");

}