import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import CellConditions from '../../../enums/cell-condition';
import Player from '../../../enums/player';
import ShipInfo from '../../../types/ShipInfo';
import Board from '../Board';
import './ship.scss';

class Ship {
  public shipInfo: ShipInfo;
  public hitsCount: number = 0;
  public decksCoords: number[][];

  private board: Board;
  private shipName: string;

  constructor(board: Board, coords: ShipInfo, shipName: string) {
    this.board = board;
    this.shipName = shipName;
    this.shipInfo = coords;
    this.decksCoords = [];
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
    const component = document.createElement(AppTag.DIV);
    component.classList.add(AppCssClass.SHIP);
    component.dataset.name = this.shipName;

    if (this.shipInfo.shipPlace.direction[0] === 1) {
      component.style.width = `${this.board.shipSide}px`;
      component.style.height = `${this.board.shipSide * this.shipInfo.decksCount}px`;
    } else {
      component.style.width = `${this.board.shipSide * this.shipInfo.decksCount}px`;
      component.style.height = `${this.board.shipSide}px`;
    }

    component.style.left = `${this.shipInfo.shipPlace.y * this.board.shipSide}px`;
    component.style.top = `${this.shipInfo.shipPlace.x * this.board.shipSide}px`;
    this.board.board.append(component);

    component.addEventListener('contextmenu', (event) => this.shipRotate(component, event));

    component.draggable = true;

    component.addEventListener('dragstart', (event) => {
      this.shipInMatrix('remove');
      event.dataTransfer?.setDragImage(component, 0, 0);
    });

    component.addEventListener('drag', (event) => {
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
        this.board.board.classList.remove('placing-error');
      } else {
        this.board.board.classList.add('placing-error');
      }
    });

    component.addEventListener('dragend', (event) => this.dragEndHandler(event, component));
  }

  private dragEndHandler(event: DragEvent, component: HTMLElement) {
    this.board.board.classList.remove('placing-error');

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
      component.style.left = `${this.shipInfo.shipPlace.y * this.board.shipSide}px`;
      component.style.top = `${this.shipInfo.shipPlace.x * this.board.shipSide}px`;
    }
    this.shipInMatrix('add');
  }

  private shipRotate(ship: HTMLElement, event: MouseEvent) {
    event.preventDefault();

    const directionArr = this.shipInfo.shipPlace.direction;

    this.shipInMatrix('remove');

    [directionArr[0], directionArr[1]] = [directionArr[1], directionArr[0]];

    if (this.board.isValidPlace(this.shipInfo.shipPlace, this.shipInfo.decksCount)) {
      [ship.style.width, ship.style.height] = [ship.style.height, ship.style.width];
    } else {
      ship.className = 'ship';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ship.className = 'ship animation-error';
        });
      });

      [directionArr[0], directionArr[1]] = [directionArr[1], directionArr[0]];
    }
    this.shipInMatrix('add');
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
