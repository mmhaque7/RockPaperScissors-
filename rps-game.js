class RpsGame {
    constructor(p1, p2) {
        this._players = [p1, p2];
        this._turns = [null, null];

        this._sendToPlayers('Game Start!!');

        this._players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this._onTurn(idx, turn);
            });
        });

    }
    _sendToPlayers(msg) {
        this._players.forEach((player) => {
            player.emit('message', msg);

        });
    }
    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('message', msg);
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn;
        this._sendToPlayer(playerIndex, `You selected ${turn}`);
        this._checkGameOver();
    }

    _checkGameOver() {
        const turns = this._turns;
        if (turns[0] && turns[1]) {
            this._sendToPlayers('Game Over! ' + turns.join(' : '));
            this._getGameResult();
            this._turns[null, null];
            this._sendToPlayers('Next Round!');
        }
    }
    _getGameResult() {
        const p0 = this._decodeTurn(this._turns[0]);
        const p1 = this._decodeTurn(this._turns[1]);

        const distance = (p1 - p0 + 3) % 3;

        switch(distance){
            case 0:
            //game is draw
                this._sendToPlayers('Draw!');
                break;
            case 1:
            //player 1 won
                this._sendwinMsg(this._players[0],this._players[1]);
                break;
            case 2:
            //player 2 wow
                this._sendwinMsg(this._players[1],this._players[0]);
                break;
        }

    }

    _sendwinMsg(winner, loser){
        winner.emit('message', 'You Won!!');
        loser.emit('message', 'You Lose!');
    }
    _decodeTurn(turn) {
        switch (turn) {
            case 'rock':
                return 0;
            case 'scissors':
                return 1;
            case 'paper':
                return 2;
            default:
                throw new Error(`Could not decode turn ${turn}`);
        }
    }


}
module.exports = RpsGame;