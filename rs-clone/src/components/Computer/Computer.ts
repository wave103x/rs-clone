import BoardUtils from "../../utils/BoardUtils";
import BoardData from "../Board/BoardData";

class Computer {
    private _difficult: string;
    private hitCoords: number[][];

    constructor(difficult: string) {
        this._difficult = difficult;
        this.hitCoords = BoardUtils.createCoordMatrix(BoardData[this._difficult].length);
    }
}

export default Computer;
