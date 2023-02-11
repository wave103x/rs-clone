import AbstractView from '../View';
import Board from '../../Board/Board';
import Game from '../../Game/Game';

import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import Difficulties from '../../../enums/difficulties';
import Player from '../../../enums/player';
import GameType from '../../../enums/game-type';

import BoardData from '../../Board/BoardData';
import BoardDataType from '../../../types/BoardDataType';

import './game-view.scss';

class GameView extends AbstractView {
  protected _component = document.createElement(AppTag.DIV);

  private _board: Board;
  private _enemyBoard!: Board;
  private gameType: string;

  constructor(board: Board, gameType: string) {
    super();
    this._board = board;
    this.gameType = gameType;

    if (gameType === GameType.solo) {
      this._enemyBoard = new Board(this._board.difficult, Player.enemy);
    } else {
      //Таблица врага
    }
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.GAME);

    this._component.append(createContainer(this._board));

    //Переделать под таблицу игрока
    if (this._enemyBoard) {
      this._component.append(createContainer(this._enemyBoard, GameType.solo));
    }

    const game = new Game(this._board, this._enemyBoard, this.gameType);
    game.start();

    //Добавить обсервер или типо того на изменение состояния кораблей
    function createContainer(board: Board, gameType?: string): HTMLElement {
      const container = document.createElement(AppTag.DIV);
      container.classList.add(AppCssClass.GAME_CONTAINER);

      let boardName: string = '';
      switch (gameType) {
        case undefined:
          boardName = 'You'; //имя игрока
          break;
        case GameType.solo:
          boardName = 'Компьютер';
          break;
        case GameType.online: //имя другого игрока
          break;
      }

      const boardNameBlock = document.createElement(AppTag.P);
      boardNameBlock.classList.add(AppCssClass.GAME_BOARD_NAME);
      boardNameBlock.innerText = boardName;

      //Вынести в отдельную функцию
      const squadronBlock = document.createElement(AppTag.DIV);
      squadronBlock.classList.add(AppCssClass.GAME_SQUADRON);

      const data: BoardDataType =
        board.difficult == Difficulties.normal ? BoardData.normal : BoardData.easy;
      for (let ship in data.ships) {
        const row = document.createElement(AppTag.DIV);
        row.classList.add(AppCssClass.GAME_SQUADRON_ROW);
        if (gameType) row.classList.add(AppCssClass.GAME_SQUADRON_ROW_RIGHT);

        for (let i = 0; i < data.ships[ship][0]; i++) {
          const shipBlock = document.createElement(AppTag.DIV);
          shipBlock.classList.add(AppCssClass.GAME_SHIP);
          shipBlock.dataset.name = ship + i;

          shipBlock.style.width = `${(board.shipSide / 2) * data.ships[ship][1]}px`;

          row.append(shipBlock);
        }
        squadronBlock.append(row);
      }

      container.append(board.getComponent(), boardNameBlock, squadronBlock);

      return container;
    }
  }
}

export default GameView;
