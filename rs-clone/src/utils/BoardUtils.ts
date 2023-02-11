import Board from '../components/Board/Board';
import AppTag from '../enums/app-tag';
import CellConditions from '../enums/cell-condition';

class BoardUtils {
  static createZeroMatrix(n: number): number[][] {
    return [...new Array(n)].map(() => new Array(n).fill(CellConditions.empty));
  }

  static createCoordMatrix(n: number): number[][] {
    const arr = new Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        arr.push([i, j]);
      }
    }

    return arr;
  }

  static getRandomNumber(n: number): number {
    return Math.floor(Math.random() * (n + 1));
  }

  static getMatrixCoords(e: MouseEvent, board: Board): number[] {
    const boardX = board.board.getBoundingClientRect().left + +window.pageXOffset;
    const boardY = board.board.getBoundingClientRect().top + +window.pageYOffset;
    const x = Math.floor((e.pageX - boardX) / board.shipSide);
    const y = Math.floor((e.pageY - boardY) / board.shipSide);
    return [x, y];
  }

  static addMarker(board: Board, coords: number[], cssClass: string): void {
    const markedCell = document.createElement(AppTag.DIV);
    markedCell.classList.add(cssClass);
    markedCell.style.left = `${coords[0] * board.shipSide}px`;
    markedCell.style.top = `${coords[1] * board.shipSide}px`;

    board.board.append(markedCell);

    board.markedCells.push({
      x: coords[0],
      y: coords[1],
      cell: markedCell,
    });
  }
}

export default BoardUtils;
