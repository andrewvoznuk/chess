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
                this.placePiece({file: file, rank: rank}, piece);
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

    getAvailableMovesForPiece(square) {
        const availableMoves = [];

        const piece = this.board[square[0]][square[1]];
        if (!piece) {
            return availableMoves;
        }
        const pieceClass = piece.constructor.name;

        console.log(pieceClass);
        switch (pieceClass) {
            case 'Rook':
                return this.getAvailableMovesForRook(square);
        }


        return availableMoves;
    }

    getAvailableMovesForRook(square) {
        const availableMoves = [];

        const x = square[0], y = square[1];

        for (let i = x - 1; i >= 0; i--) {
            if (!this.board[i][y]) {
                availableMoves.push([i, y]);
            } else {
                break;
            }
        }
        for (let i = x + 1; i < 8; i++) {
            if (!this.board[i][y]) {
                availableMoves.push([i, y]);
            } else {
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) {
            if (!this.board[x][i]) {
                availableMoves.push([x, i]);
            } else {
                break;
            }
        }
        for (let i = y + 1; i < 8; i++) {
            if (!this.board[x][i]) {
                availableMoves.push([x, i]);
            } else {
                break;
            }
        }

        return availableMoves;
    }
}

module.exports = {
    Chess
}