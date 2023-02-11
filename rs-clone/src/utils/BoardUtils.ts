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
}

export default BoardUtils;
