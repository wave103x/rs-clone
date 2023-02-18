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
import User from '../../User/User';
import Server from '../../Server/Server';

class GameView extends AbstractView {
  public time = new Date(0);
  public server: Server;
  public user: User;

  protected _component = document.createElement(AppTag.DIV);

  private _board: Board;
  private _enemyBoard!: Board;
  private gameType: string;
  private _gameTime = document.createElement(AppTag.P);
  private _turnAnons = document.createElement(AppTag.P);
  private playerTurns = document.createElement(AppTag.P);
  private enemyTurns = document.createElement(AppTag.P);
  private timer!: NodeJS.Timer;
  private readonly PLAYER_TURN = 'Стреляйте!';
  private readonly ENEMY_TURN = 'Враг атакует';

  //Добавить сокет в конструктор
  constructor(board: Board, gameType: string, server: Server, user: User, socket: undefined) {
    super();
    this._board = board;
    this.gameType = gameType;
    this.server = server;
    this.user = user;

    if (gameType === GameType.solo) {
      this._enemyBoard = new Board(this._board.difficult, Player.enemy);
    } else {
      //Таблица врага
      //Передать матрицу и сквадрон
    }
    this.createComponent();
  }

  public setTurn() {
    if (this._turnAnons.textContent === this.PLAYER_TURN) {
      this._turnAnons.textContent = this.ENEMY_TURN;
    } else this._turnAnons.textContent = this.PLAYER_TURN;
  }

  public setTurnCount(turns: number, target: 'enemy' | 'player') {
    if (target === 'enemy') {
      this.enemyTurns.textContent = `выстрелов врага: ${turns}`;
    } else {
      this.playerTurns.textContent = `ваших выстрелов: ${turns}`;
    }
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.GAME);

    //Переделать на рандом ход
    this._turnAnons.textContent = this.PLAYER_TURN;
    const stats = this.createStats();

    this._component.append(createContainer(this._board), stats);
    this._component.append(createContainer(this._enemyBoard, this.gameType));

    const game = new Game(this._board, this._enemyBoard, this.gameType, this);
    game.start();

    function createContainer(board: Board, gameType?: string): HTMLElement {
      const container = document.createElement(AppTag.DIV);
      container.classList.add(AppCssClass.GAME_CONTAINER);

      let boardName: string = '';
      switch (gameType) {
        case undefined:
          boardName = 'Вы'; //имя игрока
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
          shipBlock.dataset.name = ship + (i + 1);
          board.squadron[ship + (i + 1)].bottomShipBlock = shipBlock;

          shipBlock.style.width = `${(board.shipSide / 2) * data.ships[ship][1]}px`;

          row.append(shipBlock);
        }
        squadronBlock.append(row);
      }

      container.append(board.getComponent(), boardNameBlock, squadronBlock);

      return container;
    }
  }

  private createStats() {
    const container = document.createElement(AppTag.DIV);

    container.className = AppCssClass.GAME_STATS;
    this._gameTime.className = AppCssClass.GAME_STATS_TIMER;
    this._turnAnons.className = AppCssClass.GAME_STATS_ANONS;
    this.playerTurns.className = AppCssClass.GAME_STATS_TURNS_COUNT;
    this.enemyTurns.className = AppCssClass.GAME_STATS_TURNS_COUNT;

    this.playerTurns.textContent = `ваших выстрелов: 0`;
    this.enemyTurns.textContent = `выстрелов врага: 0`;

    this._gameTime.textContent = this.setTime();

    this.timer = setInterval(() => {
      this.time.setSeconds(this.time.getSeconds() + 1);

      this._gameTime.textContent = this.setTime();
    }, 1000);

    container.append(this._gameTime, this._turnAnons, this.playerTurns, this.enemyTurns);
    return container;
  }

  public setTime(stop?: true) {
    if (stop) {
      clearInterval(this.timer);
    }
    return `${this.time.getMinutes() < 10 ? '0' : ''}${this.time.getMinutes()}:${
      this.time.getSeconds() < 10 ? '0' : ''
    }${this.time.getSeconds()}`;
  }
}

export default GameView;
