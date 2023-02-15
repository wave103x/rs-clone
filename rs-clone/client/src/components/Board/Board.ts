import AbstractView from '../Views/View';
import Ship from './Ship/Ship';
import AppCssClass from '../../enums/app-css-class';
import AppTag from '../../enums/app-tag';
import CellCondition from '../../enums/cell-condition';
import BoardDataType from '../../types/BoardDataType';
import './board.scss';
import BoardData from './BoardData';
import BoardUtils from '../../utils/BoardUtils';
import ShipInfo from '../../types/ShipInfo';
import Squadron from '../../types/Squadron';
import Side from './SideData';
import Difficulties from '../../enums/difficulties';
import Cell from '../../types/Cell';

class Board extends AbstractView {
  public board: HTMLElement = document.createElement(AppTag.DIV);
  public player: string;
  public matrix: number[][];
  public squadron: Squadron;
  public shipSide: number;
  public difficult: string;
  public markedCells: Cell[] = [];
  public playerTurn: boolean = false;

  protected _component: HTMLElement = document.createElement(AppTag.DIV);
  private readonly smallClientWidth: number = 768;
  private readonly alphabet: string = 'abcdefghij';
  private readonly EVENT_DRAGOVER = 'dragover';

  private data: BoardDataType;
  private darkBlock: HTMLElement | undefined;

  //Протестить для легкой
  constructor(difficult: string, player: string, matrix?: number[][], squadron?: Squadron) {
    super();

    this.difficult = difficult;
    this.player = player;

    difficult === Difficulties.normal
      ? (this.data = BoardData.normal)
      : (this.data = BoardData.easy);
    if (document.documentElement.clientWidth > this.smallClientWidth) {
      this.shipSide = Side.large.ship;
      //this.boardSide = Side.large.board;
    } else {
      this.shipSide = Side.small.ship;
      //this.boardSide = Side.small.board;
    }

    if (matrix && squadron) {
      this.matrix = matrix;
      this.squadron = squadron;
      for (let ship in squadron) {
        squadron[ship].createShip();
      }
    } else {
      this.squadron = {};
      this.matrix = BoardUtils.createZeroMatrix(this.data.length);
      this.randomPlaceShips();
    }
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.BOARD_MARKUP);
    if (this.difficult === Difficulties.easy) {
      this._component.classList.add(AppCssClass.BOARD_MARKUP_EASY);
    }

    this._component.append(createEmptyBlock());

    for (let i = 0; i < this.data.length; i++) {
      this._component.append(createEmptyBlock(this.alphabet[i]));
    }

    const emptyContainer = document.createElement(AppTag.DIV);
    emptyContainer.classList.add(AppCssClass.EMPTY_CONTAINER);
    for (let i = 0; i < this.data.length; i++) {
      emptyContainer.append(createEmptyBlock((i + 1).toString()));
    }

    this.board.classList.add(AppCssClass.BOARD, AppCssClass.BOARD_IMG);
    if (this.difficult === Difficulties.easy) {
      this.board.classList.add(AppCssClass.BOARD_EASY);
    }

    this._component.append(emptyContainer, this.board);

    function createEmptyBlock(text?: string): HTMLElement {
      const block = document.createElement(AppTag.DIV);
      block.classList.add(AppCssClass.BOARD_EMPTY_BLOCK);
      if (text) block.innerText = text;
      return block;
    }

    this.board.addEventListener(this.EVENT_DRAGOVER, (event) => {
      event?.preventDefault();
    });
  }

  clear(): void {
    this.board.replaceChildren();
    this.squadron = {};
    this.matrix = BoardUtils.createZeroMatrix(this.data.length);
  }

  randomPlaceShips() {
    try {
      for (let type in this.data.ships) {
        let shipsCount = this.data.ships[type][0];
        let decksCount = this.data.ships[type][1];

        for (let i = 0; i < shipsCount; i++) {
          let coords = randomShipCoords(decksCount, this);
          const shipName = type + (i + 1).toString();
          const ship = new Ship(this, coords, shipName);
          ship.createShip();
        }
      }
    } catch {
      this.clear();
      this.randomPlaceShips();
    }

    function randomShipCoords(decksCount: number, board: Board): ShipInfo {
      const directionX = BoardUtils.getRandomNumber(1);
      const direction: number[] = [directionX, directionX === 0 ? 1 : 0];

      let x, y: number;
      if (direction[0] === 0) {
        x = BoardUtils.getRandomNumber(board.data.length - 1);
        y = BoardUtils.getRandomNumber(board.data.length - decksCount);
      } else {
        x = BoardUtils.getRandomNumber(board.data.length - decksCount);
        y = BoardUtils.getRandomNumber(board.data.length - 1);
      }

      const shipPlace = { x, y, direction };

      if (!board.isValidPlace(shipPlace, decksCount)) return randomShipCoords(decksCount, board);

      return {
        shipPlace: shipPlace,
        decksCount: decksCount,
      };
    }
  }

  isValidPlace(
    shipPlace: { x: number; y: number; direction: number[] },
    decksCount: number
  ): boolean {
    if (shipPlace.x < 0 || shipPlace.y < 0) return false;

    let toX!: number;
    let toY!: number;
    const fromX: number = shipPlace.x == 0 ? shipPlace.x : shipPlace.x - 1;
    if (
      shipPlace.x + shipPlace.direction[0] * decksCount == this.data.length &&
      shipPlace.direction[0] == 1
    )
      toX = shipPlace.x + shipPlace.direction[0] * decksCount;
    else if (
      shipPlace.x + shipPlace.direction[0] * decksCount < this.data.length &&
      shipPlace.direction[0] == 1
    )
      toX = shipPlace.x + shipPlace.direction[0] * decksCount + 1;
    else if (shipPlace.x == this.data.length - 1 && shipPlace.direction[0] == 0)
      toX = shipPlace.x + 1;
    else if (shipPlace.x < this.data.length - 1 && shipPlace.direction[0] == 0)
      toX = shipPlace.x + 2;

    const fromY: number = shipPlace.y == 0 ? shipPlace.y : shipPlace.y - 1;

    if (
      shipPlace.y + shipPlace.direction[1] * decksCount == this.data.length &&
      shipPlace.direction[1] == 1
    )
      toY = shipPlace.y + shipPlace.direction[1] * decksCount;
    else if (
      shipPlace.y + shipPlace.direction[1] * decksCount < this.data.length &&
      shipPlace.direction[1] == 1
    )
      toY = shipPlace.y + shipPlace.direction[1] * decksCount + 1;
    else if (shipPlace.y == this.data.length - 1 && shipPlace.direction[1] == 0)
      toY = shipPlace.y + 1;
    else if (shipPlace.y < this.data.length - 1 && shipPlace.direction[1] == 0)
      toY = shipPlace.y + 2;
    if (!toX || !toY) return false;

    if (
      this.matrix
        .slice(fromX, toX)
        .filter((arr) => arr.slice(fromY, toY).includes(CellCondition.ship)).length > 0
    ) {
      return false;
    }

    return true;
  }

  switchBlock() {
    if (!this.darkBlock) {
      this.darkBlock = document.createElement(AppTag.DIV);
      this.darkBlock.classList.add(AppCssClass.DARK_BLOCK);
      this.board.append(this.darkBlock);
    } else {
      this.darkBlock.remove();
      this.darkBlock = undefined;
    }
  }
}

export default Board;
