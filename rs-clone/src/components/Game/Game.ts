import GameType from '../../enums/game-type';
import Board from '../Board/Board';
import Computer from '../Computer/Computer';

class Game {
  private _firstPlayer: Board;
  private _secondPlayer: Board;
  private _gameType: string;
  private computer!: Computer;

  constructor(firstPlayer: Board, secondPlayer: Board, gameType: string) {
    this._firstPlayer = firstPlayer;
    this._secondPlayer = secondPlayer;
    this._gameType = gameType;
  }

  start() {
    //Возможно изменить запрет на перетаскивание
    this._firstPlayer.canMoving = false;
    if ((this._gameType = GameType.solo))
      this.computer = new Computer(this._secondPlayer.difficult);
  }
}

export default Game;
