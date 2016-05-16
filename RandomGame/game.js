var fs = require("fs"),
    random = require("bm-random"),
    colors = require("colors"),
    prompt = require("prompt"),
    argv = require("minimist")(process.argv.slice(2)),
    file = argv["_"][0];


var regExp = /^(1|2)$/;
var schemaGame = {
    properties: {
        num: {
            description: "Введите 1(орел), либо 2(решка)",
            pattern: regExp,
            message: "Введите 1(орел), либо 2(решка)"
        }
    }
};
var schemaContinue = {
    properties: {
        question: {
            description: "Хотите продолжить игру? 1 - Да, 2 - Нет",
            pattern: regExp,
            message: "Введите корректную команду!"
        }
    }
};
prompt.start();
prompt.message = "";

startGame();

function startGame() {
    prompt.get(schemaGame, function (err, result) {
        var rand = random.fromRange(1, 2);
        console.log(colors.yellow(rand));
        if (err) {
            throw err;
        } else if (rand === +result.num) {
            console.log(colors.green("Вы выиграли!"))
        } else {
            console.log(colors.red("Вы проиграли! ЛУЗЕЕЕР!"))
        }
        fs.appendFile(file || "game_log.txt", result.num + "," + rand + "\n", function (err) {
            if (err) throw err;
            console.log("Результат сохранен");
            continueGame();
        });
    });
}

function continueGame() {
    prompt.get(schemaContinue, function (err, result) {
        if (err) {
            throw err
        } else if (+result.question === 1) {
            startGame();
        } else {
            process.exit();
        }
    });
}