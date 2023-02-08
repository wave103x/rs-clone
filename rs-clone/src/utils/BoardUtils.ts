import CellConditions from '../enums/cell-condition';

class BoardUtils {
  static createZeroMatrix(n: number) {
    return [...new Array(n)].map(() => new Array(n).fill(CellConditions.empty));
  }

  static getRandomNumber(n: number): number {
    return Math.floor(Math.random() * (n + 1));
  }
}

export default BoardUtils;
