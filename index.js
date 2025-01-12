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
const cellSize = 100;
const boardSize = cellSize * 8;
const width = boardSize, height = boardSize;
let whitePerspective = false;

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
    let availableMoves = [];

    let isMoveInProgress = false;
    let moveFrom = null;

    game.on("mouseclick", function (event) {
        //"event" object contains
        const button = event.button; //Mouse button (scrollwheel, left, right, side1, side2)
        const x = Math.floor(event.x / cellSize); //x position of mouse click
        const y = Math.floor(event.y / cellSize); //y position of mouse click
        console.log("Mouse button pressed: " + button + " at " + x + ", " + y)
        const file = whitePerspective ? x : 7 - x;
        const rank = whitePerspective ? y : 7 - y;

        if (!isMoveInProgress) {
            availableMoves = chess.getAvailableMovesForPiece([file, rank]);
            if (availableMoves.length > 0) {
                isMoveInProgress = true;
                moveFrom = {file: file, rank: rank};
            }
        } else {
            // if move is possible
            let movePossible = false;
            availableMoves = chess.getAvailableMovesForPiece([moveFrom.file, moveFrom.rank]);
            for (const availableMove of availableMoves) {
                if (availableMove[0] === file && availableMove[1] === rank) {
                    movePossible = true;
                    break;
                }
            }
            if (movePossible) {
                availableMoves = [];
                chess.makeMove(moveFrom, {file: file, rank: rank});
                isMoveInProgress = false;
                moveFrom = null;
            } else {
                availableMoves = chess.getAvailableMovesForPiece([file, rank]);
                if (availableMoves.length > 0) {
                    isMoveInProgress = true;
                    moveFrom = {file: file, rank: rank};
                }
            }
        }
        render()
    })

    game.on("keypress", function (event) {
        let key = event.key; //Which key has been pressed
        let shiftKey = event.shiftKey; //Is shift pressed while pressing that key
        let ctrlKey = event.ctrlKey; //Is control pressed while pressing that key
        console.log("Key pressed: " + key + ", is shift pressed: " + shiftKey + ", is control pressed: " + ctrlKey);
        if ('r' === key) {
            whitePerspective = !whitePerspective;
        }
        render()
    })

    function render() {
        game.image('board', 0, 0, boardSize, boardSize);
        const files = 'abcdefgh';

        for (let i = 0; i < 8; i++) {
            const ii = whitePerspective ? i : 7 - i;
            game.text(ii * cellSize + 2, boardSize - 5, files[i], [0, 0, 0], 20, "Arial")
            game.text(boardSize - 15, (7 - ii) * cellSize + 20, '' + (i + 1), [0, 0, 0], 20, "Arial")
            for (let j = 0; j < 8; j++) {
                const piece = chess.board[i][j];
                if ('undefined' === typeof piece) {
                    continue;
                }
                if (null === piece) {
                    continue;
                }
                const color = piece.isWhite ? 'w' : 'b';
                const pe = shortMap[piece.constructor.name];
                const ii = whitePerspective ? i : 7 - i;
                const jj = whitePerspective ? j : 7 - j;

                game.image(color + pe, ii * cellSize, jj * cellSize, cellSize, cellSize);
            }
        }

        for (const possibleMove of availableMoves) {
            const ii = whitePerspective ? possibleMove[0] : 7 - possibleMove[0];
            const jj = whitePerspective ? possibleMove[1] : 7 - possibleMove[1];
            game.circle(ii * cellSize + cellSize / 2, jj * cellSize + cellSize / 2, cellSize * 0.15, [0, 200, 0]);
        }

        game.renderFrame()
    }

    render();
}, width, height);

// const initialPosition = "rnbqkbnr/pp2pppp/8/2pp4/4P3/3B1N2/PPPP1PPP/RNBQK2R w KQkq - 1 2";
// const initialPosition = "r3k2r/pp2pppp/8/2pp4/4P3/3B1N2/PPPP1PPP/R3K2R b KQkq - 1 2";
// const initialPosition = "8/3R1B2/2p5/1Q1b4/3KP3/2N5/8/8 b - - 1 2";
//const initialPosition = "4k2r/ppp1qNpp/2n4r/2bpp3/3Bn1Q1/PBNP3P/1PP2Pb1/R3K2R w KQk - 1 15";
const initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const chess = new Chess(initialPosition);