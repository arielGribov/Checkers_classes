class CheckersLogic {
    constructor() {
        this.logicBoard = new Board();
        this.isWhiteTurn = true;
        this.justAte = false;
        this.isPieceClicked = false;
        this.whitePieceCounter = 12;
        this.blackPieceCounter = 12;
        this.piecesCanEatId = [];
        this.locationPieceMustMove = [];
        this.arrayCounter = 0;
        this.pieceMustEatAgain = null;
        this.wayToGo = 0;
        this.logicPieceMove;
        this.logicBoxChosenId;
        this.rightPiece;
        this.leftPiece;
        this.right2Piece;
        this.left2Piece;
        this.amIeatingNow = false;
    }
    checkFirstClick(pieceChosen, boardId) {
        let result;
        if (pieceChosen == null) return false;
        if (this.logicBoard[pieceChosen.id[0] / 1][pieceChosen.id[1] / 1] == null) return false;
        this.logicPieceMove = this.logicBoard[pieceChosen.id[0]][pieceChosen.id[1]];
        this.wayToGo = this.logicPieceMove.isWhite ? 1 : -1;
        this.setSons(pieceChosen.id[0] / 1, pieceChosen.id[1] / 1);
        if (!((this.isWhiteTurn === this.logicPieceMove.isWhite) || (!this.isWhiteTurn === !this.logicPieceMove.isWhite))) return false;
        if (this.pieceMustEatAgain !== null && pieceChosen.id !== this.pieceMustEatAgain.location.x + '' + this.pieceMustEatAgain.location.y + "" + boardId) return false;
        result = this.checkSons();
        if (this.justAte || this.logicPieceMove.isKing) {
            this.wayToGo *= -1;
            this.setSons(pieceChosen.id[0] / 1, pieceChosen.id[1] / 1);
            result = this.checkSons();
        }
        return result;
    }
    checkSons() {
        if (this.rightPiece === undefined || this.leftPiece === undefined) {
            if (this.logicPieceMove.location.y === 7 || this.logicPieceMove.location.y === 0) return true;
            return false;
        }
        if (this.rightPiece === null || this.leftPiece === null) return true;
        if (this.logicPieceMove.isWhite === this.rightPiece.isWhite && this.logicPieceMove.isWhite === this.leftPiece.isWhite) return false;
        if (this.logicPieceMove.isWhite !== this.rightPiece.isWhite && this.right2Piece === null) return true;
        if (this.logicPieceMove.isWhite !== this.leftPiece.isWhite && this.left2Piece === null) return true;
        return false;
    }
    setSons(x, y) {
        this.rightPiece = this.logicBoard[x + this.wayToGo] !== undefined && y + 1 <= 8 ? this.logicBoard[x + this.wayToGo][y + 1] : undefined;
        this.leftPiece = this.logicBoard[x + this.wayToGo] !== undefined && y - 1 >= 0 ? this.logicBoard[x + this.wayToGo][y - 1] : undefined;
        this.right2Piece = this.logicBoard[x + 2 * this.wayToGo] !== undefined && y + 2 <= 8 ? this.logicBoard[x + 2 * this.wayToGo][y + 2] : undefined;
        this.left2Piece = this.logicBoard[x + 2 * this.wayToGo] !== undefined && y - 2 >= 0 ? this.logicBoard[x + 2 * this.wayToGo][y - 2] : undefined;
    }
    canEat(boardId) {
        let pieceToCheck;
        this.piecesCanEatId = [];
        this.arrayCounter = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                pieceToCheck = this.logicBoard[x][y];
                if (pieceToCheck == null) continue;
                if (this.isMySonAnEatableEnemy(x, y, pieceToCheck)) {
                    this.piecesCanEatId[this.arrayCounter] = x + '' + y + "" + boardId;
                    this.arrayCounter++;
                }
            }
        }
    }
    isMySonAnEatableEnemy(x, y, pieceToCheck) {
        let isNewPiece = false;
        this.wayToGo = pieceToCheck.isWhite ? 1 : -1;
        if (!(this.justAte || pieceToCheck.isKing)) {
            if (pieceToCheck.isWhite && this.isWhiteTurn && x > 5) return false;
            if (!pieceToCheck.isWhite && !this.isWhiteTurn && x < 2) return false;
        }
        if (this.logicBoard[x][y].isWhite !== this.isWhiteTurn) return false;
        isNewPiece |= this.checkGrandson(x, y, isNewPiece)
        if (this.justAte || pieceToCheck.isKing) {
            this.wayToGo *= -1;
            isNewPiece |= this.checkGrandson(x, y, isNewPiece)
        }
        return isNewPiece;
    }
    checkGrandson(x, y, isNewPiece) {
        this.setSons(x, y);
        isNewPiece = false;
        if (this.leftPiece === undefined && this.rightPiece === undefined) return false;
        if (this.leftPiece != null) {
            if (((this.isWhiteTurn && this.logicPieceMove.isWhite && !this.leftPiece.isWhite) || (!this.isWhiteTurn && !this.logicPieceMove.isWhite && this.leftPiece.isWhite)) && this.left2Piece === null) {
                this.locationPieceMustMove[this.locationPieceMustMove.length] = (x + 2 * this.wayToGo) + '' + (y - 2);
                isNewPiece = true;
            }
        }
        if (this.rightPiece != null) {
            if (((this.isWhiteTurn && this.logicPieceMove.isWhite && !this.rightPiece.isWhite) || (!this.isWhiteTurn && !this.logicPieceMove.isWhite && this.rightPiece.isWhite)) && this.right2Piece === null) {
                this.locationPieceMustMove[this.locationPieceMustMove.length] = (x + 2 * this.wayToGo) + '' + (y + 2);
                isNewPiece = true;
            }
        }
        return isNewPiece;
    }
    isMoveLegal() {
        if (!this.logicBoard[this.logicBoxChosenId[0]][this.logicBoxChosenId[1]] === null) return false;
        if (this.logicPieceMove == null) return false;
        if (!this.logicPieceMove.isKing) {
            if (!this.justAte) {
                if (!(this.isWhiteTurn ? this.logicBoxChosenId[0] > this.logicPieceMove.location.x : this.logicBoxChosenId[0] < this.logicPieceMove.location.x))
                    return false;
            }
        }
        if (this.locationPieceMustMove.length > 0) {
            for (let i = 0; i < this.locationPieceMustMove.length; i++) {
                if (this.locationPieceMustMove[i] === (this.logicBoxChosenId[0] + this.logicBoxChosenId[1])) {
                    this.amIeatingNow = true;
                    return true;
                }
            }
            return false;
        }
        else if (this.locationPieceMustMove == null || this.locationPieceMustMove.length === 0) {
            if (Math.abs(this.logicBoxChosenId[0] - this.logicPieceMove.location.x) === 1 && Math.abs(this.logicBoxChosenId[1] - this.logicPieceMove.location.y) === 1)
                return true;
        }
        return false;
    }
    getMiddleBox() {
        let minPieceIdX = this.logicPieceMove.location.x < this.logicBoxChosenId[0] ? this.logicPieceMove.location.x : this.logicBoxChosenId[0];
        let minPieceIdY = this.logicPieceMove.location.y < this.logicBoxChosenId[1] ? this.logicPieceMove.location.y : this.logicBoxChosenId[1];
        minPieceIdX++, minPieceIdY++;
        return this.logicBoard[minPieceIdX][minPieceIdY];
    }
    moveLogicPiece() {
        let location = new Location(this.logicPieceMove.location.x, this.logicPieceMove.location.y);
        this.logicBoard[this.logicBoxChosenId[0]][this.logicBoxChosenId[1]] = this.logicPieceMove;
        this.logicBoard[this.logicBoxChosenId[0]][this.logicBoxChosenId[1]].location.x = this.logicBoxChosenId[0] / 1;
        this.logicBoard[this.logicBoxChosenId[0]][this.logicBoxChosenId[1]].location.y = this.logicBoxChosenId[1] / 1;
        this.logicBoard[location.x][location.y] = null;
    }
    resetAllLogic() {
        this.piecesCanEatId = [];
        this.arrayCounter = 0;
        this.locationPieceMustMove = [];
        this.pieceMustEatAgain = null;
        this.wayToGo = 0;
        this.logicBoxChosenId = null;
        this.logicPieceMove = null;
        this.rightPiece = null, this.leftPiece = null, this.right2Piece = undefined, this.left2Piece = undefined;
        this.amIeatingNow = false;
    }
}
class CheckersUI {
    constructor() {
        this.pieceClickedId = null;// the last piece clicked on the board and its id
        this.pieceChosen = null;// the final piece chosen
        this.boxChosen = null;// where the piece going to
        this.visualBoard = this.htmlBoard();
        this.htmlGame(this.visualBoard);
        this.gamePlay = new CheckersLogic;
        this.boardId = 0;
        this.visualBoard.addEventListener('click', (event) => {
            this.pieceClickedId = event.target.id;
            if (this.pieceClickedId === "" || this.pieceClickedId === 'board') return false;
            if (!(this.pieceChosen == null || this.pieceChosen.id === this.pieceClickedId)) return false;
            this.boardId = event.target.parentElement.parentElement.id;
            this.pieceChosen = document.getElementById(this.pieceClickedId);
            if (!this.gamePlay.checkFirstClick(this.pieceChosen, this.boardId)) {
                this.pieceChosen = null;
                return false;
            }
            this.gamePlay.canEat(this.boardId);
            if (this.gamePlay.piecesCanEatId.length > 0) {
                for (let i = 0; i < this.gamePlay.piecesCanEatId.length; i++) {
                    if (this.gamePlay.piecesCanEatId[i] === this.pieceClickedId)
                        this.pieceChosen.classList.toggle('clicked');
                }
            }
            if (this.gamePlay.piecesCanEatId == null || this.gamePlay.piecesCanEatId.length === 0)
                this.pieceChosen.classList.toggle('clicked');
            if (!this.pieceChosen.classList.contains('clicked'))
                this.pieceChosen = null;
            else this.isPieceClicked = true;
        });
        this.visualBoard.addEventListener('click', (event) => {
            if (!event.target.classList.contains('black')) return false;
            if (!this.isPieceClicked) return false;
            this.boxChosen = event.target.firstChild;
            if(!this.boxChosen.classList.contains('no_piece')) return false;
            this.gamePlay.logicBoxChosenId = this.boxChosen.id[0] + '' + this.boxChosen.id[1];
            if (!this.secondClick()) return false;
            if (this.gamePlay.justAte) {
                if (this.checkIfCanEatAgain())
                    return false;
            }
            this.checkForWin();
            this.endTurn();
        });
        this.modal = document.getElementById("myModal");
        this.btn = document.getElementById("myBtn");
        this.span = document.getElementsByClassName("close")[0];
        this.span.onclick = () => {
            this.modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == this.modal) 
                this.modal.style.display = "none";
        }
    }
    htmlBoard() {
        const board = document.createElement("div");
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                const piece = document.createElement('button');
                board.appendChild(cell);
                piece.classList.add('piece');
                cell.classList.add("box");
                if (i % 2 === 0) {
                    if (j % 2 === 0)
                        cell.classList.add("white");
                    else {
                        cell.classList.add("black");
                        if (i === 0 || i === 2) {
                            piece.classList.add('white_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                        if (i === 6) {
                            piece.classList.add('black_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                        if (i === 3 || i === 4) {
                            piece.classList.add('no_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                    }
                }
                else {
                    if (j % 2 === 0) {
                        cell.classList.add("black");
                        if (i === 5 || i === 7) {
                            piece.classList.add('black_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                        if (i === 1) {
                            piece.classList.add('white_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                        if (i === 3 || i === 4) {
                            piece.classList.add('no_piece');
                            piece.id = i + "" + j + "" + gameCounter;
                            cell.appendChild(piece);
                        }
                    }
                    else
                        cell.classList.add("white");
                }
            }
        }
        return board;
    }
    htmlGame(board) {
        gamesContainer.appendChild(board);
        board.classList.add('board');
        board.id = gameCounter;
        const player = document.createElement('div');
        board.appendChild(player);
        player.classList.add('player');
        player.id = "player" + gameCounter;
        player.innerHTML = 'Player :';
        const turn = document.createElement('div');
        board.appendChild(turn);
        turn.classList.add('turn');
        turn.id = "turn" + gameCounter;
        turn.style = 'background-Color : rgb(233, 224, 173);';
        return board;
    }
    secondClick() {
        if (this.gamePlay.isMoveLegal()) {
            if (this.gamePlay.amIeatingNow) this.eat();
            this.movePiece();
        } else return false;
        if (this.isPieceAKing())
            this.pieceBecomeKing();
        return true;
    }
    eat() {
        this.removePiece(this.gamePlay.getMiddleBox());
        this.gamePlay.isWhiteTurn ? this.gamePlay.blackPieceCounter-- : this.gamePlay.whitePieceCounter--;
        this.gamePlay.justAte = true;
    }
    movePiece() {
        this.gamePlay.moveLogicPiece();
        this.moveHtmlPiece();
    }
    moveHtmlPiece() {
        let whosTurn = this.gamePlay.isWhiteTurn ? 'white_piece' : 'black_piece';
        this.boxChosen.classList.remove('no_piece');
        this.boxChosen.classList.add(whosTurn);
        this.pieceChosen.classList.remove(whosTurn, 'clicked');
        this.pieceChosen.classList.add('no_piece');
        if (this.pieceChosen.classList.contains('king')) {
            this.pieceBecomeKing();
            this.removeHtmlKing(this.pieceChosen);
        }
    }
    removePiece(pieceToRemove) {
        if (pieceToRemove.isKing) {
            this.removeHtmlKing(document.getElementById(pieceToRemove.location.x + "" + pieceToRemove.location.y + "" + this.boardId));
            this.gamePlay.logicBoard[pieceToRemove.location.x][pieceToRemove.location.y].isKing = false;
        }
        let pieceHtml = document.getElementById(pieceToRemove.location.x + "" + pieceToRemove.location.y + "" + this.boardId)
        pieceHtml.classList.remove(this.gamePlay.isWhiteTurn ? 'black_piece' : 'white_piece');
        pieceHtml.classList.add('no_piece');
        this.gamePlay.logicBoard[pieceToRemove.location.x][pieceToRemove.location.y] = null;
    }
    checkIfCanEatAgain() {
        let rememberPiece = this.gamePlay.logicBoard[this.gamePlay.logicBoxChosenId[0]][this.gamePlay.logicBoxChosenId[1]];
        let rememberBoardId = this.boardId;
        this.resetAll();
        this.boardId = rememberBoardId;
        this.gamePlay.logicPieceMove = rememberPiece;
        if (!this.gamePlay.isMySonAnEatableEnemy(this.gamePlay.logicPieceMove.location.x / 1, this.gamePlay.logicPieceMove.location.y / 1, this.gamePlay.logicPieceMove)) {
            this.gamePlay.justAte = false;
            return false;
        }
        this.gamePlay.pieceMustEatAgain = this.gamePlay.logicPieceMove;
        return true;
    }
    isPieceAKing() {
        if ((this.boxChosen.classList.contains('white_piece') && this.boxChosen.id[0] == 7) || (this.boxChosen.classList.contains('black_piece') && this.boxChosen.id[0] == 0))
            return true;
        return false;
    }
    pieceBecomeKing() {
        this.boxChosen.classList.remove('piece');
        this.boxChosen.classList.add('king');
        this.boxChosen.innerHTML = 'K';
        this.gamePlay.logicBoard[this.gamePlay.logicBoxChosenId[0]][this.gamePlay.logicBoxChosenId[1]].isKing = true;
    }
    removeHtmlKing(pieceChosen) {
        pieceChosen.classList.remove('king');
        pieceChosen.classList.add('piece');
        pieceChosen.innerHTML = '';
    }
    checkForWin() {
        if (this.gamePlay.whitePieceCounter === 0) {
            document.getElementById('massege').innerHTML = "Board game no #" + (this.boardId / 1 + 1) + " black wins!!"
            this.modal.style.display = "block";
            return true;
        }
        if (this.gamePlay.blackPieceCounter === 0) {
            document.getElementById('massege').innerHTML = "Board game no #" + (this.boardId / 1 + 1) + " white wins!!"
            this.modal.style.display = "block";
            return true;
        }
        return false;
    }
    endTurn() {
        this.gamePlay.isWhiteTurn = !this.gamePlay.isWhiteTurn;
        document.getElementById('turn' + this.boardId).style = this.gamePlay.isWhiteTurn ? 'background-Color: rgb(233, 224, 173);' : 'background-Color: rgb(57, 11, 11);';
        this.resetAll();
    }
    resetAll() {
        this.pieceChosen = null;
        this.pieceClickedId = null;
        this.boxChosen = null;
        this.isPieceClicked = false;
        this.boardId = -1;
        this.gamePlay.resetAllLogic();
    }
}
class Piece {
    constructor(isWhite, x, y) {
        this.isWhite = isWhite;
        this.isKing = false;
        this.location = new Location(x, y);
    }
}
class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Board {
    constructor() {
        return [
            [undefined, new Piece(true, 0, 1), undefined, new Piece(true, 0, 3), undefined, new Piece(true, 0, 5), undefined, new Piece(true, 0, 7)],
            [new Piece(true, 1, 0), undefined, new Piece(true, 1, 2), undefined, new Piece(true, 1, 4), undefined, new Piece(true, 1, 6), undefined],
            [undefined, new Piece(true, 2, 1), undefined, new Piece(true, 2, 3), undefined, new Piece(true, 2, 5), undefined, new Piece(true, 2, 7)],
            [null, undefined, null, undefined, null, undefined, null, undefined],
            [undefined, null, undefined, null, undefined, null, undefined, null],
            [new Piece(false, 5, 0), undefined, new Piece(false, 5, 2), undefined, new Piece(false, 5, 4), undefined, new Piece(false, 5, 6), undefined],
            [undefined, new Piece(false, 6, 1), undefined, new Piece(false, 6, 3), undefined, new Piece(false, 6, 5), undefined, new Piece(false, 6, 7)],
            [new Piece(false, 7, 0), undefined, new Piece(false, 7, 2), undefined, new Piece(false, 7, 4), undefined, new Piece(false, 7, 6), undefined]
        ];
    }
}

let gamesContainer = document.getElementById('js-games-container');
let newGameButton = document.getElementById('js-new-game');
let gameCounter = 0;
let games = [];
newGameButton.addEventListener('click', () => {
    let newGameUi = new CheckersUI();
    games[gameCounter] = newGameUi;
    gameCounter++;
    gamesContainer.appendChild(newGameUi.visualBoard);
});