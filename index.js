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
        possibleMoves = [];
        possibleMoves.push([x, y + 1])
        possibleMoves.push([x, y - 1])
        possibleMoves.push([x - 1, y])
        possibleMoves.push([x + 1, y])

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
                const flipJ = 7 - j;
                game.image(color + pe, i * 100, flipJ * 100, 100, 100);
            }
        }

        for (const possibleMove of possibleMoves) {
            game.circle(possibleMove[0] * 100 + 50, possibleMove[1] * 100 + 50, 20, [0, 200, 0]);
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

    constructor(fen) {
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
        }
        const fenParts = fen.split(' ');
        const fenPieces = fenParts[0];
        let rank = 0, file = 0;
        for (const char of fenPieces) {
            let piece;
            const isWhite = (char === char.toUpperCase());
            switch (char.toLowerCase()) {
                case 'r':
                    piece = new Rook(isWhite);
                    break;
                case 'n':
                    piece = new Knight(isWhite);
                    break;
                case 'b':
                    piece = new Bishop(isWhite);
                    break;
                case 'q':
                    piece = new Queen(isWhite);
                    break;
                case 'k':
                    piece = new King(isWhite);
                    break;
                case 'p':
                    piece = new Pawn(isWhite);
                    break;
                case '/':
                    file = 0;
                    rank++;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    file += parseInt(char);
                    break;
            }

            if (piece) {
                this.placePiece({file: file, rank: 7 - rank}, piece);
                file++;
            }
        }
        this.isWhiteToMove = fenParts[1].toLowerCase() === 'w';
    }

    placePiece(square, piece) {
        let file, rank;
        if (typeof square === 'string' || square instanceof String) {
            file = fileMap[square[0]];
            rank = square[1] - 1;
        } else {
            file = square.file;
            rank = square.rank;
        }
        this.board[file][rank] = piece
    }
}

// const initialPosition = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
const initialPosition = "8/8/8/3R4/8/8/8/8 w KQkq - 1 2";
const chess = new Chess(initialPosition);