import CellConditions from '../enums/cell-condition';
import Board from '../components/Board/Board';

class BoardUtils {
  static createZeroMatrix(n: number) {
    return [...new Array(n)].map(() => new Array(n).fill(CellConditions.empty));
  }

  static getRandomNumber(n: number): number {
    return Math.floor(Math.random() * (n + 1));
  }

  static getMatrixCoords(e: MouseEvent, board: Board): number[] {
    const boardX = board.board.getBoundingClientRect().left + +window.pageXOffset;
    const boardY = board.board.getBoundingClientRect().top + +window.pageYOffset;
    const x = Math.floor((e.pageY - boardY) / board.shipSide);
    const y = Math.floor((e.pageX - boardX) / board.shipSide);
    return [x, y];
  }
}

export default BoardUtils;
