import AbstractView from '../View';
import Board from '../../Board/Board';
import GameView from '../GameView/GameView';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import Difficulties from '../../../enums/difficulties';
import Player from '../../../enums/player';
import GameType from '../../../enums/game-type';
import './pregame-view.scss';
import User from '../../User/User';
import Server from '../../Server/Server';
import AppAttribute from '../../../enums/app-attribute';

class PreGameView extends AbstractView {
  protected _component = document.createElement(AppTag.DIV);
  private difficult: string = Difficulties.normal;
  private _board = new Board(this.difficult, Player.ally);
  private gameType: string;
  private boardContainer!: HTMLElement;
  private _server: Server;
  private _user: User;

  private readonly LOAD_TEXT = 'Поиск соперника';
  private readonly SHUFFLE_BUTTON_TEXT = 'Перемешать';
  private readonly SHUFFLE_TEXT = 'ПКМ для поворота';
  private readonly CONTROL_TEXT = 'Режим игры';
  private readonly PLAY_BUTTON_TEXT = 'Играть';
  private readonly difficultInfo = {
    easy: {
      name: 'Легкий',
      features: ['Поле 6x6', 'Меньше кораблей'],
    },
    normal: {
      name: 'Классический',
      features: ['Хорошо знакомая всем игра'],
    },
  };

  constructor(gameType: string, server: Server, user: User) {
    super();
    this.gameType = gameType;
    this._server = server;
    this._user = user;
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.PREGAME);

    this.boardContainer = this.createBoardContainer();
    this._component.append(this.boardContainer, this.createControlPanel());
  }

  private createBoardContainer(): HTMLElement {
    const container = document.createElement(AppTag.DIV);
    container.classList.add(AppCssClass.BOARD_CONTAINER);

    const shuffleButton = document.createElement(AppTag.BUTTON);
    shuffleButton.classList.add(AppCssClass.BUTTON);
    shuffleButton.innerText = this.SHUFFLE_BUTTON_TEXT;
    shuffleButton.addEventListener('click', () => {
      this._board.clear();
      this._board.randomPlaceShips();
    });

    const buttonText = document.createElement(AppTag.P);
    buttonText.classList.add(AppCssClass.BOARD_CONTAINER_TEXT);
    buttonText.innerText = this.SHUFFLE_TEXT;

    container.append(this._board.getComponent(), shuffleButton, buttonText);

    return container;
  }

  private createControlPanel(): HTMLElement {
    const difficulties: HTMLElement[] = [];

    const controlContainer = document.createElement(AppTag.DIV);
    controlContainer.classList.add(AppCssClass.CONTROL_CONTAINER);

    const controlHeader = document.createElement(AppTag.H2);
    controlHeader.classList.add(AppCssClass.CONTROL_HEADER);
    controlHeader.innerText = this.CONTROL_TEXT;

    controlContainer.append(controlHeader);

    const difficultContainer = document.createElement(AppTag.DIV);
    difficultContainer.classList.add(AppCssClass.DIFFICULT_CONTAINER);

    if (this.gameType === GameType.solo) {
      const easyDifficult = createDifficult(this.difficultInfo.easy, Difficulties.easy, this);

      const normalDifficult = createDifficult(this.difficultInfo.normal, Difficulties.normal, this);
      normalDifficult.classList.add(AppCssClass.DIFFICULT_ACTIVE);

      difficultContainer.append(easyDifficult, normalDifficult);
    } else {
      const randomEnemy = createDifficult(
        { name: 'Случайный противник', features: [] },
        Difficulties.normal,
        this
      );
      randomEnemy.classList.add(AppCssClass.DIFFICULT_ACTIVE);
      difficultContainer.append(randomEnemy);
    }

    controlContainer.append(difficultContainer);

    const buttonPlay = document.createElement(AppTag.BUTTON);
    buttonPlay.classList.add(AppCssClass.BUTTON_BIG, AppCssClass.BUTTON);
    buttonPlay.innerText = this.PLAY_BUTTON_TEXT;
    buttonPlay.addEventListener('click', () => {
      startGame(this);
    });

    controlContainer.append(buttonPlay);

    return controlContainer;

    function createDifficult(
      features: { name: string; features: string[] },
      difficult: string,
      control: PreGameView
    ): HTMLElement {
      const difficultBlock = document.createElement(AppTag.BUTTON);
      difficulties.push(difficultBlock);
      difficultBlock.classList.add(AppCssClass.DIFFICULT);
      difficultBlock.addEventListener('click', toggleDifficult);

      difficultBlock.append(createDifficultHeader(features.name));

      if (features.features.length != 0) {
        difficultBlock.append(creteDifficultFeatures(features.features));
      }

      return difficultBlock;

      function toggleDifficult() {
        if (!difficultBlock.classList.contains(AppCssClass.DIFFICULT_ACTIVE)) {
          difficulties.forEach((elem) => elem.classList.remove(AppCssClass.DIFFICULT_ACTIVE));
          difficultBlock.classList.add(AppCssClass.DIFFICULT_ACTIVE);

          control.difficult = difficult;

          //Возможно вынести в отдельную функцию
          control.boardContainer.remove();
          control._board = new Board(control.difficult, Player.ally);
          control.boardContainer = control.createBoardContainer();
          control._component.prepend(control.boardContainer);
        }
      }
    }

    function createDifficultHeader(name: string): HTMLElement {
      const header = document.createElement(AppTag.H3);
      header.classList.add(AppCssClass.DIFFICULT_HEADER);
      header.innerText = name;

      return header;
    }

    function creteDifficultFeatures(features: string[]): HTMLElement {
      const ol = document.createElement(AppTag.UL);
      ol.classList.add(AppCssClass.DIFFICULT_FEATURES);

      features.forEach((feature) => {
        const li = document.createElement(AppTag.LI);
        li.innerText = feature;
        ol.append(li);
      });

      return ol;
    }

    function startGame(pregameView: PreGameView) {
      
      if (pregameView.gameType === GameType.online) {
        const loadBlock = pregameView.createLoadingBlock();
        document.body.append(loadBlock);
        // //TODO:
        // //Экран ожидания
        // //Открытие подключения
        // //зарандомить чей первый ход на сервере
        // //Отправить чей первый ход (у одного будет первый игрок, у другого второй игрок)
        // //Отправить объект таблицы
        // //Когда все данные получены - создать GameView и убрать экран ожидания
        // pregameView._component.remove();
        // //Передать сокет
        // //Передать первый ход
        // //Передать вражескую таблицу
        // document.body.append(
        //   new GameView(
        //     pregameView._board,
        //     pregameView.gameType,
        //     pregameView._server,
        //     pregameView._user
        //   ).getComponent()
        // );
      } else {
        pregameView._component.remove();

        document.body.append(
          new GameView(
            pregameView._board,
            pregameView.gameType,
            pregameView._server,
            pregameView._user
          ).getComponent()
        );
      }
    }
  }

  private createLoadingBlock(): HTMLElement {
    const container = document.createElement(AppTag.DIV);
    container.classList.add(AppCssClass.LOAD_BLOCK_CONTAINER);

    const block = document.createElement(AppTag.DIV);
    block.classList.add(AppCssClass.LOAD_BLOCK);

    container.append(block);

    const img = new Image();
    img.classList.add(AppCssClass.LOAD_BLOCK_IMG);
    img.src = require('../../../assets/icons/load-ship.svg') as string;

    const title = document.createElement(AppTag.P);
    title.classList.add(AppCssClass.LOAD_BLOCK_TITLE);
    title.innerText = this.LOAD_TEXT;

    block.append(img, title);

    return container;
  }
}

export default PreGameView;
