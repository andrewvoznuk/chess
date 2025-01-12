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

        switch (pieceClass) {
            case 'Queen':
                return this.getAvailableMovesForQueen(square);
            case 'Rook':
                return this.getAvailableMovesForRook(square);
            case 'Bishop':
                return this.getAvailableMovesForBishop(square);
            case 'Knight':
                return this.getAvailableMovesForKnight(square);
            case 'King':
                return this.getAvailableMovesForKing(square);
            case 'Pawn':
                return this.getAvailableMovesForPawn(square);
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

    getAvailableMovesForBishop(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];

        for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
            if (!this.board[i][j]) {
                availableMoves.push([i, j]);
            } else {
                break;
            }
        }
        for (let i = x + 1, j = y - 1; i < 8 && j >= 0; i++, j--) {
            if (!this.board[i][j]) {
                availableMoves.push([i, j]);
            } else {
                break;
            }
        }
        for (let i = x + 1, j = y + 1; i < 8 && j < 8; i++, j++) {
            if (!this.board[i][j]) {
                availableMoves.push([i, j]);
            } else {
                break;
            }
        }
        for (let i = x - 1, j = y + 1; i >= 0 && j < 8; i--, j++) {
            if (!this.board[i][j]) {
                availableMoves.push([i, j]);
            } else {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableMovesForKnight(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];

        for (let xDirection = 0; xDirection < 2; xDirection++) {
            for (let yDirection = 0; yDirection < 2; yDirection++) {
                const xMultiplier = xDirection ? 1 : -1;
                const yMultiplier = yDirection ? 1 : -1;
                if ((x + 2 * xMultiplier) >= 0 && (x + 2 * xMultiplier) < 8 && (y + 1 * yMultiplier) >= 0 && (y + 1 * yMultiplier) < 8 && !this.board[x + 2 * xMultiplier][y + 1 * yMultiplier]) {
                    availableMoves.push([x + 2 * xMultiplier, y + 1 * yMultiplier]);
                }
                if ((x + 1 * xMultiplier) >= 0 && (x + 1 * xMultiplier) < 8 && (y + 2 * yMultiplier) >= 0 && (y + 2 * yMultiplier) < 8 && !this.board[x + 1 * xMultiplier][y + 2 * yMultiplier]) {
                    availableMoves.push([x + 1 * xMultiplier, y + 2 * yMultiplier]);
                }
            }
        }

        return availableMoves;
    }

    getAvailableMovesForQueen(square) {
        const r = this.getAvailableMovesForRook(square);
        const b = this.getAvailableMovesForBishop(square);

        return r.concat(b)
    }

    getAvailableMovesForKing(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];

        for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, 7); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, 7); j++) {
                if (!this.board[i][j]) {
                    availableMoves.push([i, j]);
                }
            }
        }

        return availableMoves;
    }

    getAvailableMovesForPawn(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];
        const piece = this.board[square[0]][square[1]];

        const direction = piece.isWhite ? -1 : 1;

        if (!this.board[x][y + direction]) {
            availableMoves.push([x, y + direction]);
        } else {
            return availableMoves;
        }

        const isFirstRank = (piece.isWhite && y === 6) || (!piece.isWhite && y === 1);
        if (isFirstRank && !this.board[x][y + 2 * direction]) {
            availableMoves.push([x, y + 2 * direction]);
        }

        return availableMoves;
    }
}

module.exports = {
    Chess
}
