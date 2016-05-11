var fs = require("fs"),
    random = require("bm-random"),
    colors = require("colors"),
    prompt = require("prompt");

var schema = {
    properties: {
        num: {
            description: "Введите 1(орел), либо 2(решка)",
            pattern: /^(1|2)$/,
            message: "Введите 1(орел), либо 2(решка)"
        }
    }
};
prompt.start();
prompt.message = "";

startGame();

function startGame() {
    prompt.get(schema, function (err, result) {
        var rand = random.fromRange(1, 2);
        console.log(colors.red(rand));
        if (rand === +result.num) {
            console.log("Вы выиграли!")
        } else {
            console.log("Вы проиграли! ЛУЗЕЕЕР!")
        }
        fs.appendFile("RandomGame/game_log.txt", result.num + "," + rand + "\n", function(err) {
            if (err) throw err;
            console.log("Результат сохранен");
            startGame();
        });
    });
}

