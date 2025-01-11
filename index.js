const nodegames = require("nodegamesjs");

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
    game.setWindowName("My Chess");
    game.on('close', function () {
        process.exit(0);
    });

    function render() {
        console.log("Rendering game...")

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
                const flipJ = 7 - j;
                game.image(color + pe, i * 100, flipJ * 100, 100, 100);
            }
        }

        game.renderFrame()
    }

    render();
}, width, height);


class Piece {
    isWhite;

    constructor(isWhite) {
        this.isWhite = isWhite;
    }
}

class Pawn extends Piece {
}

class Rook extends Piece {
}

class Knight extends Piece {
}

class Bishop extends Piece {
}

class Queen extends Piece {
}

class King extends Piece {
}


class Chess {
    board = new Array(8);

    constructor() {
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
        }
        this.placePiece('a7', new Pawn());
        this.placePiece('e7', new Pawn());
        this.placePiece('b7', new Pawn());
        this.placePiece('c7', new Pawn());
        this.placePiece('d7', new Pawn());
        this.placePiece('f7', new Pawn());
        this.placePiece('g7', new Pawn());
        this.placePiece('h7', new Pawn());

        this.placePiece('a8', new Rook());
        this.placePiece('e8', new King());
        this.placePiece('b8', new Knight());
        this.placePiece('c8', new Bishop());
        this.placePiece('d8', new Queen());
        this.placePiece('f8', new Bishop());
        this.placePiece('g8', new Knight());
        this.placePiece('h8', new Rook());


        this.placePiece('a2', new Pawn(true));
        this.placePiece('e2', new Pawn(true));
        this.placePiece('b2', new Pawn(true));
        this.placePiece('c2', new Pawn(true));
        this.placePiece('d2', new Pawn(true));
        this.placePiece('f2', new Pawn(true));
        this.placePiece('g2', new Pawn(true));
        this.placePiece('h2', new Pawn(true));


        this.placePiece('a1', new Rook(true));
        this.placePiece('e1', new King(true));
        this.placePiece('b1', new Knight(true));
        this.placePiece('c1', new Bishop(true));
        this.placePiece('d1', new Queen(true));
        this.placePiece('f1', new Bishop(true));
        this.placePiece('g1', new Knight(true));
        this.placePiece('h1', new Rook(true));
    }

    placePiece(square, piece) {
        const file = fileMap[square[0]];
        const line = square[1] - 1;
        this.board[file][line] = piece
    }
}

const chess = new Chess();