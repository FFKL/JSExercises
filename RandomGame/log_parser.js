var fs = require("fs"),
    sugar = require("sugar"),
    argv = require("minimist")(process.argv.slice(2)),
    file = argv["_"][0];
const WIN = "0", LOST = "1";

fs.readFile(file || "game_log.txt", function(err, result) {
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
        gamesCount = res.length,
        resultArr = [];
    for (var i = 0; i < gamesCount; i++) {
        var gameResult = res[i];
        if (gameResult[0] === gameResult[2]) {
            win++;
            resultArr.push(WIN);
        } else {
            lost++;
            resultArr.push(LOST);
        }
    }
    var hWin, hLost;
    countStreaks(resultArr, function (highestStreakWin, highestStreakLost) {
        hWin = highestStreakWin;
        hLost = highestStreakLost;
    });
    var winPercent = (win * 100) / gamesCount;
    var lostPercent = 100 - winPercent;
    console.log("Всего игр сыграно: " + gamesCount + "\n" +
                "Победы: " + win + "\n" +
                "Поражения: " + lost + "\n" +
                "Процент побед: " + winPercent + "\n" +
                "Процент поражений: " + lostPercent + "\n" +
                "Побед подряд: " + hWin + "\n" +
                "Поражений подряд: " + hLost);

}

function countStreaks(result, callback) {
    var currentStreak = 0,
        highestStreakWin = 0,
        highestStreakLost = 0;
        for (var i = 0; i < result.length; i++) {
            currentStreak++;
            if (result[i] === result[i + 1]) {
            } else {
                if (result[i] === WIN && currentStreak > highestStreakWin) {
                    highestStreakWin = currentStreak;
                } else if (result[i] === LOST && currentStreak > highestStreakLost) {
                    highestStreakLost = currentStreak;
                }
                currentStreak = 0;
            }
        }
    callback(highestStreakWin, highestStreakLost);

}