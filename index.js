import nodegames from "nodegamesjs";

import {Chess} from "./chess.js";

import * as fs from "fs";

const shortMap = {
    Pawn: 'p',
    Rook: 'r',
    Knight: 'n',
    Bishop: 'b',
    Queen: 'q',
    King: 'k',
}

const fileMap = {
    a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7
}

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
        render()
    })
    game.setWindowName("My Chess");
    game.on('close', function () {
        process.exit(0);
    });
    let possibleMoves = [];

    game.on("mouseclick", function (event) {
        //"event" object contains
        const button = event.button; //Mouse button (scrollwheel, left, right, side1, side2)
        const x = Math.floor(event.x / 100); //x position of mouse click
        const y = Math.floor(event.y / 100); //y position of mouse click
        console.log("Mouse button pressed: " + button + " at " + x + ", " + y)
        possibleMoves = chess.getAvailableMovesForPiece([x,y])
        render()
    })

    function render() {
        game.image('board', 0, 0, 800, 800);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = chess.board[i][j];
                if ('undefined' === typeof piece) {
                    continue;
                }
                if ('null' === piece) {
                    continue;
                }
                const color = piece.isWhite ? 'w' : 'b';
                const pe = shortMap[piece.constructor.name];
                const flipJ = j;
                game.image(color + pe, i * 100, flipJ * 100, 100, 100);
            }
        }

        for (const possibleMove of possibleMoves) {
            game.circle(possibleMove[0] * 100 + 50, possibleMove[1] * 100 + 50, 15, [0, 200, 0]);
        }

        game.renderFrame()
    }

    render();
}, width, height);

// const initialPosition = "rnbqkbnr/pp2pppp/8/2pp4/4P3/3B1N2/PPPP1PPP/RNBQK2R w KQkq - 1 2";
// const initialPosition = "r3k2r/pp2pppp/8/2pp4/4P3/3B1N2/PPPP1PPP/R3K2R b KQkq - 1 2";
const initialPosition = "8/3R1B2/8/1Q1b4/8/2N5/8/8 w KQkq - 1 2";
// const initialPosition = "K3RK1K/8/8/2QRB3/4N3/8/8/K6K w KQkq - 1 2";
const chess = new Chess(initialPosition);