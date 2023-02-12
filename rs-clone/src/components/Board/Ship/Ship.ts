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

    component.addEventListener('contextmenu', () => this.shipRotate(component));

    component.draggable = true;

    component.addEventListener('dragstart', (event) => {
      const coords = component.getBoundingClientRect();
      const data = {
        left: Math.round(event.pageX - coords.left),
        top: Math.round(event.pageY - coords.top),
        shipInfo: this.shipInfo,
        name: this.shipName
      }
      event.dataTransfer?.setData('clickCoords', JSON.stringify(data));
    })
  }

  private shipRotate(ship: HTMLElement) {
    event?.preventDefault();
    const directionArr = this.shipInfo.shipPlace.direction;

    for (let i = 0; i < this.shipInfo.decksCount; i++) {
      const x = this.shipInfo.shipPlace.x + i * directionArr[0];
      const y = this.shipInfo.shipPlace.y + i * directionArr[1];
      this.board.matrix[x][y] = CellConditions.empty;
    }

    [directionArr[0], directionArr[1]] = [
      directionArr[1],
      directionArr[0],
    ];

    if (this.board.isValidPlace(this.shipInfo.shipPlace, this.shipInfo.decksCount)) {
      const tmpWidth = ship.style.width;
      ship.style.width = ship.style.height;
      ship.style.height = tmpWidth;

      for (let i = 0; i < this.shipInfo.decksCount; i++) {
        const x = this.shipInfo.shipPlace.x + i * directionArr[0];
        const y = this.shipInfo.shipPlace.y + i * directionArr[1];
        this.board.matrix[x][y] = CellConditions.ship;
      }
    }
    else {
      ship.className = 'ship';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ship.className = "ship animation-error";
        });
      });

      [directionArr[0], directionArr[1]] = [
        directionArr[1],
        directionArr[0],
      ];

      for (let i = 0; i < this.shipInfo.decksCount; i++) {
        const x = this.shipInfo.shipPlace.x + i * directionArr[0];
        const y = this.shipInfo.shipPlace.y + i * directionArr[1];
        this.board.matrix[x][y] = CellConditions.ship;
      }
    }
  }



}

export default Ship;
