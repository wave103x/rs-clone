import AppCssClass from '../../enums/app-css-class';
import CellConditions from '../../enums/cell-condition';
import GameType from '../../enums/game-type';
import BoardUtils from '../../utils/BoardUtils';
import Board from '../Board/Board';
import Ship from '../Board/Ship/Ship';
import WinView from '../Views/WinView/WinView';
import Computer from '../Computer/Computer';
import './cell.scss';
import GameView from '../Views/GameView/GameView';
import { io, Socket } from "socket.io-client";
class Game {
  private readonly DRUG_LOCK = 'remove';
  //private readonly DRUG_UNLOCK = 'add';
  end = false;

  private _firstPlayer: Board;
  private _secondPlayer: Board;
  private _playerNum = 0;
  private _enemyNum = 0;
  private _gameType: string;
  private computer!: Computer;
  private _playerTurns: number = 0;
  private _enemyTurns: number = 0;
  private _gameView: GameView;

  private readonly winText = ['Победа!', 'Поражение!'];

  constructor(firstPlayer: Board, secondPlayer: Board, gameType: string, gameView: GameView) {
    this._firstPlayer = firstPlayer;
    this._secondPlayer = secondPlayer;
    this._gameType = gameType;
    this._gameView = gameView;
    this.testSocket()
  }

  start(): void {
    for (const ship of Object.values(this._firstPlayer.squadron)) {
      ship.changeDruggable(this.DRUG_LOCK);
    }

    if ((this._gameType = GameType.solo))
      this.computer = new Computer(this._secondPlayer.difficult, this._firstPlayer, this);

    this._secondPlayer.playerTurn = true;
    this._firstPlayer.switchBlock();

    this.addListeners();

  }

  makeHitOrMiss(board: Board, coords: number[]): number[][] | undefined {
    const type = board.matrix[coords[0]][coords[1]];

    switch (type) {
      case CellConditions.ship:
        let arr = this.shotHit(board, coords);
        return arr;
      case CellConditions.empty:
        this.shotMiss(board, coords);
        return undefined;
      default:
        return undefined;
    }
  }

  private addListeners(): void {
    this._secondPlayer.board.addEventListener('contextmenu', this.toggleNoShipCell.bind(this));
    this._secondPlayer.board.addEventListener('click', this.shot.bind(this));
  }

  private toggleNoShipCell(e: MouseEvent): void {
    e.preventDefault();
    if (!this._secondPlayer.playerTurn || this.end) return;

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
  }

  private shot(e: MouseEvent): void {
    if (!this._secondPlayer.playerTurn || this.end) return;

    this._gameView.setTurnCount(++this._playerTurns, 'player');

    const coords = BoardUtils.getMatrixCoords(e, this._secondPlayer);

    const cell = this._secondPlayer.markedCells.find(
      (el) => el.x === coords[0] && el.y === coords[1]
    );

    if (cell) return;

    const board = this._secondPlayer;
    const result = this.makeHitOrMiss(board, coords);

    if (!result) this._secondPlayer.playerTurn = false;

    if (this.computer && this._secondPlayer.playerTurn === false) {
      let compResult: number[][] | undefined;
      this._gameView.setTurn();
      this._firstPlayer.switchBlock();
      this._secondPlayer.switchBlock();

      const interval = setInterval(() => {
        compResult = this.computer.shot();
        this._gameView.setTurnCount(++this._enemyTurns, 'enemy');
        if (compResult === undefined) {
          this._secondPlayer.playerTurn = true;
          this._gameView.setTurn();
          this._firstPlayer.switchBlock();
          this._secondPlayer.switchBlock();
          clearInterval(interval);
        }
      }, 800);
    } else if (this._secondPlayer.playerTurn === false) {
      //Код для онлайна
    }
  }

  private shotMiss(board: Board, coords: number[]): void {
    BoardUtils.addMarker(board, coords, AppCssClass.MISS_CELL);
    board.matrix[coords[0]][coords[1]] = CellConditions.miss;
  }

  private shotHit(board: Board, coords: number[]): number[][] {
    BoardUtils.addMarker(board, coords, AppCssClass.HIT_CELL);
    board.matrix[coords[0]][coords[1]] = CellConditions.hit;

    let noShipCellsOnHit = setNoShipCellsOnHit();
    let noShipCellsOnDead = changeSquadron();

    this.checkWin();

    return noShipCellsOnHit.concat(noShipCellsOnDead);

    function changeSquadron(): number[][] {
      let flag = true;
      let arr: number[][] = [];

      for (let ship in board.squadron) {
        if (!flag) break;

        const currentShip = board.squadron[ship];
        for (let shipCoords of currentShip.decksCoords) {
          if (shipCoords[0] != coords[0] || shipCoords[1] != coords[1]) continue;
          currentShip.hitsCount++;
          if (currentShip.hitsCount < currentShip.shipInfo.decksCount) {
            flag = false;
            break;
          }

          currentShip.markerShip();
          arr = setNoShipCellsOnDead(board.squadron[ship]);
          delete board.squadron[ship];
        }
      }
      return arr;
    }

    function setNoShipCellsOnHit(): number[][] {
      let arr = [];
      for (let i = coords[0] - 1; i <= coords[0] + 1; i += 2) {
        if (board.matrix[i] === undefined) continue;
        for (let j = coords[1] - 1; j <= coords[1] + 1; j += 2) {
          if (board.matrix[i][j] === undefined) continue;

          setNoShipCell(i, j);
          arr.push([i, j]);
        }
      }
      return arr;
    }

    function setNoShipCellsOnDead(ship: Ship): number[][] {
      const arr = [];
      if (ship.shipInfo.decksCount != 1) {
        const firstDeck = ship.decksCoords[0];
        const lastDeck = ship.decksCoords[ship.decksCoords.length - 1];

        if (ship.shipInfo.shipPlace.direction[0] === 0) {
          if (board.matrix[firstDeck[1] - 1] !== undefined) {
            setNoShipCell(firstDeck[0], firstDeck[1] - 1);
            arr.push([firstDeck[0], firstDeck[1] - 1]);
          }
          if (board.matrix[lastDeck[1] + 1] !== undefined) {
            setNoShipCell(lastDeck[0], lastDeck[1] + 1);
            arr.push([lastDeck[0], lastDeck[1] + 1]);
          }
        } else {
          if (board.matrix[firstDeck[0] - 1] !== undefined) {
            setNoShipCell(firstDeck[0] - 1, firstDeck[1]);
            arr.push([firstDeck[0] - 1, firstDeck[1]]);
          }
          if (board.matrix[lastDeck[0] + 1] !== undefined) {
            setNoShipCell(lastDeck[0] + 1, lastDeck[1]);
            arr.push([lastDeck[0] + 1, lastDeck[1]]);
          }
        }
      } else {
        const firstDeck = ship.decksCoords[0];
        for (let i = firstDeck[0] - 1; i <= firstDeck[0] + 1; i += 2) {
          if (board.matrix[i] !== undefined) {
            setNoShipCell(i, firstDeck[1]);
            arr.push([i, firstDeck[1]]);
          }
        }
        for (let i = firstDeck[1] - 1; i <= firstDeck[1] + 1; i += 2) {
          if (board.matrix[firstDeck[0]][i] !== undefined) {
            setNoShipCell(firstDeck[0], i);
            arr.push([firstDeck[0], i]);
          }
        }
      }
      return arr;
    }

    function setNoShipCell(i: number, j: number) {
      const cell = board.markedCells.find((el) => el.x === i && el.y === j);

      if (!cell) {
        BoardUtils.addMarker(board, [i, j], AppCssClass.NOSHIP_CELL);
        board.matrix[i][j] = CellConditions.noShip;
      } else if (board.matrix[i][j] === CellConditions.empty)
        board.matrix[i][j] = CellConditions.noShip;
    }
  }

  private checkWin() {
    const yourSquadron = Object.keys(this._firstPlayer.squadron).length;
    const enemySquadron = Object.keys(this._secondPlayer.squadron).length;
    let winBlock: WinView | undefined;
    let text: string = '';
    if (yourSquadron === 0 || enemySquadron === 0) {
      this.end = true;
      if (this.computer) {
        if (enemySquadron === 0) {
          //console.log('Вы победили');
          text = this.winText[0];
        } else if (yourSquadron === 0) {
          //Машина одержала верх над человеком
          //console.log('Машина одержала верх над человеком');
          text = this.winText[1];
          for (let ship in this._secondPlayer.squadron)
            this._secondPlayer.squadron[ship].showShip();
        }
      } else {
        if (enemySquadron === 0) {
          //Вы победили
          text = this.winText[0];
        } else if (yourSquadron === 0) {
          //Ваш оппонент победил
          text = this.winText[1];
        }
      }
      winBlock = new WinView(text);
      if (winBlock) document.body.append(winBlock.getComponent());
    }
  }
  testSocket() {
    const socket = io();
    socket.on('player-number', num => {
      if(num === -1) {
        alert('Извините, мест нет')
      } else {
        this._playerNum = parseInt(num);
        if(this._playerNum === 1) {
          console.log('====================================');
          console.log('you are enemy');
          console.log('====================================');
        }
      }
    })
    socket.emit('hello')
  }
}

export default Game;
