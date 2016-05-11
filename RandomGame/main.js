var readline = require("readline");
var random = require("bm-random");
var colors = require("colors");


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Введите 0, либо 1: ", function (answer) {
    var rand = random.fromRange(0, 1);
    console.log(colors.red(rand));
    if (rand === +answer) {
        console.log("Вы выиграли!")
    } else {
        console.log("Вы проиграли! ЛУЗЕЕЕР!")
    }
    rl.close();
    process.exit(); //todo: del
});

