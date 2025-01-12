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

const fileMap = {
    a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7
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
                    file += parseInt(char);
                    break;
            }

            if (piece) {
                this.placePiece({file: file, rank: rank}, piece);
                file++;
            }
        }
        this.isWhiteToMove = fenParts[1].toLowerCase() === 'w';
        const castlings = fenParts[2];
        this.cOO = {};
        this.cOOO = {};

        this.cOO[1] = castlings.includes('K');
        this.cOOO[1] = castlings.includes('Q');
        this.cOO[0] = castlings.includes('k');
        this.cOOO[0] = castlings.includes('q');

        const enPassant = fenParts[3];
        this.enPassant = null;
        if (enPassant !== '-') {
            this.enPassant = this.stringToSquare(enPassant);
        }
    }

    stringToSquare(str) {
        return [fileMap[str[0]], (9 - str[1]) - 1]
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

        if (!piece || this.isWhiteToMove !== piece.isWhite) {
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
        const isWhite = this.board[x][y].isWhite;

        for (let i = x - 1; i >= 0; i--) {
            const targetX = i, targetY = y;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = x + 1; i < 8; i++) {
            const targetX = i, targetY = y;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) {
            const targetX = x, targetY = i;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = y + 1; i < 8; i++) {
            const targetX = x, targetY = i;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableMovesForBishop(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];
        const isWhite = this.board[x][y].isWhite;

        for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
            const targetX = i, targetY = j;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = x + 1, j = y - 1; i < 8 && j >= 0; i++, j--) {
            const targetX = i, targetY = j;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = x + 1, j = y + 1; i < 8 && j < 8; i++, j++) {
            const targetX = i, targetY = j;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }
        for (let i = x - 1, j = y + 1; i >= 0 && j < 8; i--, j++) {
            const targetX = i, targetY = j;
            const move = this.canMove(isWhite, targetX, targetY);
            if (move.can) {
                availableMoves.push([targetX, targetY]);
            }
            if (!move.can || move.type === 'capture') {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableMovesForKnight(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];
        const isWhite = this.board[x][y].isWhite;

        for (let xDirection = 0; xDirection < 2; xDirection++) {
            for (let yDirection = 0; yDirection < 2; yDirection++) {
                const xMultiplier = xDirection ? 1 : -1;
                const yMultiplier = yDirection ? 1 : -1;
                if ((x + 2 * xMultiplier) >= 0 && (x + 2 * xMultiplier) < 8 && (y + 1 * yMultiplier) >= 0 && (y + 1 * yMultiplier) < 8 && (!this.board[x + 2 * xMultiplier][y + 1 * yMultiplier] || isWhite !== this.board[x + 2 * xMultiplier][y + 1 * yMultiplier].isWhite)) {
                    availableMoves.push([x + 2 * xMultiplier, y + 1 * yMultiplier]);
                }
                if ((x + 1 * xMultiplier) >= 0 && (x + 1 * xMultiplier) < 8 && (y + 2 * yMultiplier) >= 0 && (y + 2 * yMultiplier) < 8 && (!this.board[x + 1 * xMultiplier][y + 2 * yMultiplier] || isWhite !== this.board[x + 1 * xMultiplier][y + 2 * yMultiplier].isWhite)) {
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
        const piece = this.board[x][y];

        for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, 7); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, 7); j++) {
                if (this.canMove(piece.isWhite, i, j).can) {
                    availableMoves.push([i, j]);
                }
            }
        }

        if (this.cOO[+piece.isWhite] && !this.board[5][y] && !this.board[6][y]) {
            availableMoves.push([6, y]);
        }
        if (this.cOOO[+piece.isWhite] && !this.board[1][y] && !this.board[2][y] && !this.board[3][y]) {
            availableMoves.push([2, y]);
        }

        return availableMoves;
    }

    getAvailableMovesForPawn(square) {
        const availableMoves = [];
        const x = square[0], y = square[1];
        const piece = this.board[square[0]][square[1]];

        const direction = piece.isWhite ? -1 : 1;

        // en passant
        if (this.enPassant && this.enPassant[0] === x - 1 && this.board[x - 1][y].isWhite !== piece.isWhite) {
            availableMoves.push([x - 1, y + direction]);
        }
        if (this.enPassant && this.enPassant[0] === x + 1 && this.board[x + 1][y].isWhite !== piece.isWhite) {
            availableMoves.push([x + 1, y + direction]);
        }
        // regular capture
        if (x > 0 && this.board[x - 1][y + direction] && this.board[x - 1][y + direction].isWhite !== piece.isWhite) {
            availableMoves.push([x - 1, y + direction]);
        }
        if (x < 7 && this.board[x + 1][y + direction] && this.board[x + 1][y + direction].isWhite !== piece.isWhite) {
            availableMoves.push([x + 1, y + direction]);
        }

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

    canMove(isWhite, x, y) {
        return {
            can: !this.board[x][y] || isWhite !== this.board[x][y].isWhite,
            type: (this.board[x][y] && isWhite !== this.board[x][y].isWhite) ? 'capture' : 'move'
        }
    }

    makeMove(moveFrom, moveTo) {
        const piece = this.board[moveFrom.file][moveFrom.rank];
        if (!piece || piece.isWhite !== this.isWhiteToMove) {
            return;
        }
        const targetPiece = this.board[moveTo.file][moveTo.rank];
        if (targetPiece && targetPiece.constructor.name === 'Rook') {
            const rookInitialRank = targetPiece.isWhite ? 7 : 0;
            if (moveTo.file === 0 && rookInitialRank === moveTo.rank) {
                this.cOOO[+targetPiece.isWhite] = false;
            }
            if (moveTo.file === 7 && rookInitialRank === moveTo.rank) {
                this.cOO[+targetPiece.isWhite] = false;
            }
        }
        this.board[moveFrom.file][moveFrom.rank] = null;
        this.board[moveTo.file][moveTo.rank] = piece;

        const pieceClass = piece.constructor.name;

        let castling = false;

        if (pieceClass === 'King' && moveFrom.file === 4 && moveTo.file === 6) {
            this.board[5][moveTo.rank] = this.board[7][moveTo.rank];
            this.board[7][moveTo.rank] = null;
            castling = true;
        }
        if (pieceClass === 'King' && moveFrom.file === 4 && moveTo.file === 2) {
            this.board[3][moveTo.rank] = this.board[0][moveTo.rank];
            this.board[0][moveTo.rank] = null;
            castling = true;
        }
        if (castling) {
            this.cOO[+piece.isWhite] = false;
            this.cOOO[+piece.isWhite] = false;
        }

        if (pieceClass === 'King') {
            this.cOOO[+piece.isWhite] = false;
            this.cOO[+piece.isWhite] = false;
        }
        if (pieceClass === 'Rook') {
            if (moveFrom.file === 0) {
                this.cOOO[+piece.isWhite] = false;
            }
            if (moveFrom.file === 7) {
                this.cOO[+piece.isWhite] = false;
            }
        }
        if (this.enPassant && moveTo.file === this.enPassant[0] && moveTo.rank === this.enPassant[1]) {
            this.board[moveTo.file][moveFrom.rank] = null;
        }

        this.enPassant = null;
        if (pieceClass === 'Pawn') {
            if (Math.abs(moveFrom.rank - moveTo.rank) === 2) {
                this.enPassant = [moveFrom.file, (moveFrom.rank + moveTo.rank) / 2]
                console.log(this.enPassant)
            }
        }

        this.isWhiteToMove = !this.isWhiteToMove;
    }
}

module.exports = {
    Chess
}
