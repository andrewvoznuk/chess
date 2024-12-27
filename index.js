const nodegames = require("nodegamesjs");
const fs = require("fs")
const board = fs.readFileSync("./board.png");
const bb = fs.readFileSync("./pieces/bb.png");
const wb = fs.readFileSync("./pieces/wb.png");
const br = fs.readFileSync("./pieces/br.png");
const wr = fs.readFileSync("./pieces/wr.png");
const bn = fs.readFileSync("./pieces/bn.png");
const wn = fs.readFileSync("./pieces/wn.png");
const bk = fs.readFileSync("./pieces/bk.png");
const wk = fs.readFileSync("./pieces/wk.png");
const bq = fs.readFileSync("./pieces/bq.png");
const wq = fs.readFileSync("./pieces/wq.png");
const bp = fs.readFileSync("./pieces/bp.png");
const wp = fs.readFileSync("./pieces/wp.png");

nodegames.init();
let width = 800, height = 800;
nodegames.newGame(function (game) {
    game.loadImage(board, 'board')
    game.loadImage(br, 'br')
    game.loadImage(wr, 'wr')
    game.loadImage(bn, 'bn')
    game.loadImage(wn, 'wn')
    game.loadImage(bb, 'bb')
    game.loadImage(wb, 'wb')
    game.loadImage(bk, 'bk')
    game.loadImage(wk, 'wk')
    game.loadImage(bq, 'bq')
    game.loadImage(wq, 'wq')
    game.loadImage(bp, 'bp')
    game.loadImage(wp, 'wp')

    game.on("imageload", function (id) {
        //"id" is the loaded image id
        console.log("Image with id: " + id + " loaded.")
        render()
    })
    function render() {
        console.log("Rendering game...")
        // for (let i = 0; i< 4; i++) {
        //     for (let j = 0; j < 4; j++) {
        //         game.rect(i * 200, j * 200, 100, 100, [255, 255, 255])
        //         game.rect(i * 200 + 100, j * 200 + 100, 100, 100, [255, 255, 255])
        //     }
        // }

        game.image('board', 0, 0, 800, 800);

        game.image('br', 0, 0, 100, 100);
        game.image('bn', 100, 0, 100, 100);
        game.image('bb', 200, 0, 100, 100);
        game.image('bk', 300, 0, 100, 100);
        game.image('bq', 600, 0, 100, 100);
        game.image('bb', 400, 0, 100, 100);
        game.image('bn', 500, 0, 100, 100);
        game.image('br', 700, 0, 100, 100);
        game.image('bp', 0, 100, 100, 100);
        game.image('bp', 100, 100, 100, 100);
        game.image('bp', 200, 100, 100, 100);
        game.image('bp', 300, 100, 100, 100);
        game.image('bp', 400, 100, 100, 100);
        game.image('bp', 500, 100, 100, 100);
        game.image('bp', 600, 100, 100, 100);
        game.image('bp', 700, 100, 100, 100);

        game.image('wr', 0, 700, 100, 100);

        game.renderFrame()
    }

    render();
}, width, height);
