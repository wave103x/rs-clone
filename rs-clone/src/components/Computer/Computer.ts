import CellConditions from '../../enums/cell-condition';
import Difficulties from '../../enums/difficulties';
import BoardUtils from '../../utils/BoardUtils';
import Board from '../Board/Board';
import BoardData from '../Board/BoardData';
import Game from '../Game/Game';

class Computer {
  private _difficult: string;
  private allHitCoords: number[][];
  private tacticHitCoords: number[][];
  private aroundHitCoords: number[][] = [];
  private _enemyBoard: Board;
  private _game: Game;
  private readonly START_COORDS_EASY = [
    [
      [2, 0],
      [0, 2],
    ],
    [
      [3, 0],
      [5, 2],
    ],
  ];
  private readonly START_COORDS_NORMAL = [
    [
      [6, 0],
      [2, 0],
      [0, 2],
      [0, 6],
    ],
    [
      [3, 0],
      [7, 0],
      [9, 2],
      [9, 6],
    ],
  ];
  private startCoords: number[][][];

  constructor(difficult: string, enemyBoard: Board, game: Game) {
    this._difficult = difficult;
    difficult === Difficulties.easy
      ? (this.startCoords = this.START_COORDS_EASY)
      : (this.startCoords = this.START_COORDS_NORMAL);
    this._enemyBoard = enemyBoard;
    this._game = game;

    this.allHitCoords = BoardUtils.createCoordMatrix(BoardData[this._difficult].length);
    this.allHitCoords.sort((a, b) => Math.random() - 0.5);

    this.tacticHitCoords = this.getTacticCoords();
  }

  shot() {
    if (this._game.end) return;
    let coords: number[] = this.getCoords();

    const hit = this._game.makeHitOrMiss(this._enemyBoard, coords);

    this.removeCoords(coords);

    if (hit) {
      const coordsAroundHit = [
        [coords[0] - 1, coords[1]],
        [coords[0] + 1, coords[1]],
        [coords[0], coords[1] - 1],
        [coords[0], coords[1] + 1],
      ];
      this.setAroundHitCoords(coordsAroundHit);

      for (let coord of hit) {
        this.removeCoords(coord);
      }
    }
  }

  private getTacticCoords(): number[][] {
    const tacticArr: number[][] = [];

    let x: number, y: number;
    const length = BoardData[this._difficult].length - 1;

    for (let arr of this.startCoords[0]) {
      x = arr[0];
      y = arr[1];
      while (x <= length && y <= length) {
        tacticArr.push([x, y]);
        x = x <= length ? x : length;
        y = y <= length ? y : length;
        x++;
        y++;
      }
    }

    for (let arr of this.startCoords[1]) {
      x = arr[0];
      y = arr[1];
      while (x >= 0 && x <= length && y <= length) {
        tacticArr.push([x, y]);
        x = x >= 0 && x <= length ? x : x < 0 ? 0 : length;
        y = y <= length ? y : length;
        x--;
        y++;
      }
    }

    return tacticArr.reverse();
  }

  private getCoords(): number[] {
    let coords: number[];
    coords =
      this.aroundHitCoords.length > 0
        ? (this.aroundHitCoords.pop() as number[])
        : this.tacticHitCoords.length > 0
        ? (this.tacticHitCoords.pop() as number[])
        : (this.allHitCoords.pop() as number[]);

    this.removeCoords(coords);
    return coords;
  }

  private setAroundHitCoords(coords: number[][]) {
    for (let coord of coords) {
      if (
        coord[0] < 0 ||
        coord[0] > BoardData[this._difficult].length - 1 ||
        coord[1] < 0 ||
        coord[1] > BoardData[this._difficult].length - 1
      )
        continue;
      if (
        this._enemyBoard.matrix[coord[0]][coord[1]] === CellConditions.empty ||
        this._enemyBoard.matrix[coord[0]][coord[1]] === CellConditions.ship
      ) {
        this.aroundHitCoords.push(coord);
      }
    }
  }

  private removeCoords(coords: number[]): void {
    if (this.aroundHitCoords.length > 0) {
      this.aroundHitCoords = removeElement(this.aroundHitCoords, coords);
    }
    if (this.tacticHitCoords.length > 0) {
      this.tacticHitCoords = removeElement(this.tacticHitCoords, coords);
    }
    this.allHitCoords = removeElement(this.allHitCoords, coords);

    function removeElement(arr: number[][], coords: number[]): number[][] {
      return arr.filter((item) => item[0] != coords[0] || item[1] != coords[1]);
    }
  }
}

export default Computer;
