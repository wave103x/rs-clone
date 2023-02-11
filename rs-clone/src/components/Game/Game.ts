import AppCssClass from '../../enums/app-css-class';
import CellConditions from '../../enums/cell-condition';
import GameType from '../../enums/game-type';
import BoardUtils from '../../utils/BoardUtils';
import Board from '../Board/Board';
import Computer from '../Computer/Computer';
import './cell.scss';

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

    this.addListeners();
  }

  private addListeners(): void {
    this._secondPlayer.board.addEventListener('contextmenu', this.toggleNoShipCell.bind(this));
  }

  private toggleNoShipCell(e: MouseEvent): void {
    e.preventDefault();
    const coords = BoardUtils.getMatrixCoords(e, this._secondPlayer);
    const type = this._secondPlayer.matrix[coords[0]][coords[1]];
    if (
      type === CellConditions.hit ||
      type === CellConditions.miss ||
      type === CellConditions.noShip
    )
      return;

    const cell = this._secondPlayer.markedCells.find(
      (el) => el.x === coords[0] && el.y === coords[1]
    );

    if (cell) {
      cell.cell.remove();
      this._secondPlayer.markedCells = this._secondPlayer.markedCells.filter((el) => {
        return !(el.x === coords[0] && el.y === coords[1]);
      });
    } else {
      BoardUtils.addMarker(this._secondPlayer, coords, AppCssClass.NOSHIP_CELL);
    }
    console.log(this._secondPlayer.markedCells);
  }
}

export default Game;
