import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import CellConditions from '../../../enums/cell-condition';
import Player from '../../../enums/player';
import ShipInfo from '../../../types/ShipInfo';
import Board from '../Board';
import './ship.scss';
import '../../Views/GameView/game-view.scss';

class Ship {
  public shipInfo: ShipInfo;
  public hitsCount: number = 0;
  public decksCoords: number[][];
  public bottomShipBlock!: HTMLElement;

  private readonly EVENT_RIGHT_CLICK = 'contextmenu';
  private readonly EVENT_DRAGSTART = 'dragstart';
  private readonly EVENT_DRAGEND = 'dragend';
  private readonly EVENT_DRAG = 'drag';
  private readonly ADD = 'add';
  private readonly REMOVE = 'remove';
  private readonly HIDDEN = 'hidden';
  private readonly UNSET = 'unset';

  private _component!: HTMLElement;
  private board: Board;
  private shipName: string;

  constructor(board: Board, coords: ShipInfo, shipName: string) {
    this.board = board;
    this.shipName = shipName;
    this.shipInfo = coords;
    this.decksCoords = [];
  }

  markerShip() {
    this.bottomShipBlock.classList.add(AppCssClass.MARKED_SHIP);
  }

  createShip(): void {
    for (let i = 0; i < this.shipInfo.decksCount; i++) {
      const x = this.shipInfo.shipPlace.x + i * this.shipInfo.shipPlace.direction[0];
      const y = this.shipInfo.shipPlace.y + i * this.shipInfo.shipPlace.direction[1];

      this.board.matrix[x][y] = CellConditions.ship;
      this.decksCoords.push([x, y]);
    }

    this.board.squadron[this.shipName] = this;

    if (this.board.player === Player.ally) {
      this.showShip();
    }
  }

  showShip(): void {
    this._component = document.createElement(AppTag.DIV);
    this._component.classList.add(AppCssClass.SHIP);
    this._component.dataset.name = this.shipName;

    if (this.shipInfo.shipPlace.direction[0] === 1) {
      this._component.style.width = `${this.board.shipSide}px`;
      this._component.style.height = `${this.board.shipSide * this.shipInfo.decksCount}px`;
    } else {
      this._component.style.width = `${this.board.shipSide * this.shipInfo.decksCount}px`;
      this._component.style.height = `${this.board.shipSide}px`;
    }

    this._component.style.left = `${this.shipInfo.shipPlace.y * this.board.shipSide}px`;
    this._component.style.top = `${this.shipInfo.shipPlace.x * this.board.shipSide}px`;

    this.board.board.append(this._component);

    this._component.addEventListener(this.EVENT_RIGHT_CLICK, (event) =>
      this.shipRotate(this._component, event)
    );

    this._component.draggable = true;

    this._component.addEventListener(this.EVENT_DRAGSTART, (event) => {
      this.shipInMatrix(this.REMOVE);
      event.dataTransfer?.setDragImage(this._component, 0, 0);
    });

    this._component.addEventListener(this.EVENT_DRAG, (event) => {
      const boardOffset = this.board.board.getBoundingClientRect();
      const clickLeft = Math.round(event.clientX - boardOffset.left);
      const clickTop = Math.round(event.clientY - boardOffset.top);
      const newY = Math.floor(clickLeft / this.board.shipSide);
      const newX = Math.floor(clickTop / this.board.shipSide);
      const dragShipData = {
        x: newX,
        y: newY,
        direction: this.shipInfo.shipPlace.direction,
      };

      if (this.board.isValidPlace(dragShipData, this.shipInfo.decksCount)) {
        this.board.board.classList.remove(AppCssClass.PLACING_ERROR);
        this._component.style.visibility = this.HIDDEN;
      } else {
        this._component.style.visibility = this.UNSET;
        this.board.board.classList.add(AppCssClass.PLACING_ERROR);
      }
    });

    this._component.addEventListener(this.EVENT_DRAGEND, (event) => this.dragEndHandler(event));
  }

  private dragEndHandler(event: DragEvent) {
    this.board.board.classList.remove(AppCssClass.PLACING_ERROR);
    this._component.style.visibility = this.UNSET;

    const boardOffset = this.board.board.getBoundingClientRect();
    const clickLeft = Math.round(event.clientX - boardOffset.left);
    const clickTop = Math.round(event.clientY - boardOffset.top);
    const newY = Math.floor(clickLeft / this.board.shipSide);
    const newX = Math.floor(clickTop / this.board.shipSide);
    const dragShipData = {
      x: newX,
      y: newY,
      direction: this.shipInfo.shipPlace.direction,
    };

    if (this.board.isValidPlace(dragShipData, this.shipInfo.decksCount)) {
      this.shipInfo.shipPlace.x = newX;
      this.shipInfo.shipPlace.y = newY;
      this._component.style.left = `${this.shipInfo.shipPlace.y * this.board.shipSide}px`;
      this._component.style.top = `${this.shipInfo.shipPlace.x * this.board.shipSide}px`;
    }
    this.shipInMatrix(this.ADD);
  }

  private shipRotate(ship: HTMLElement, event: MouseEvent) {
    event.preventDefault();

    const directionArr = this.shipInfo.shipPlace.direction;

    this.shipInMatrix(this.REMOVE);

    [directionArr[0], directionArr[1]] = [directionArr[1], directionArr[0]];

    if (this.board.isValidPlace(this.shipInfo.shipPlace, this.shipInfo.decksCount)) {
      [ship.style.width, ship.style.height] = [ship.style.height, ship.style.width];
    } else {
      ship.className = AppCssClass.SHIP;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ship.className = `${AppCssClass.SHIP} ${AppCssClass.ANIMATION_ERROR}`;
        });
      });

      [directionArr[0], directionArr[1]] = [directionArr[1], directionArr[0]];
    }
    this.shipInMatrix(this.ADD);
  }

  changeDruggable(value: 'add' | 'remove') {
    switch (value) {
      case 'remove':
        this._component.draggable = false;
        this._component.classList.add(AppCssClass.SHIP_DRAG_LOCK);
        break;
      case 'add':
        this._component.draggable = true;
        this._component.classList.remove(AppCssClass.SHIP_DRAG_LOCK);
        break;
    }
  }

  private shipInMatrix(action: 'remove' | 'add'): void {
    for (let i = 0; i < this.shipInfo.decksCount; i++) {
      const x = this.shipInfo.shipPlace.x + i * this.shipInfo.shipPlace.direction[0];
      const y = this.shipInfo.shipPlace.y + i * this.shipInfo.shipPlace.direction[1];
      switch (action) {
        case 'remove':
          this.board.matrix[x][y] = CellConditions.empty;
          break;
        case 'add':
          this.board.matrix[x][y] = CellConditions.ship;
          break;
      }
    }
  }
}

export default Ship;
