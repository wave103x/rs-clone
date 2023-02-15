import AbstractView from '../View';
import Board from '../../Board/Board';
import GameView from '../GameView/GameView';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import Difficulties from '../../../enums/difficulties';
import Player from '../../../enums/player';
import GameType from '../../../enums/game-type';
import './pregame-view.scss';

class PreGameView extends AbstractView {
  protected _component = document.createElement(AppTag.DIV);
  private difficult: string = Difficulties.normal;
  private _board = new Board(this.difficult, Player.ally);
  private gameType: string;
  private boardContainer!: HTMLElement;

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

  constructor(gameType: string) {
    super();
    this.gameType = gameType;
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

    const easyDifficult = createDifficult(this.difficultInfo.easy, Difficulties.easy, this);

    const normalDifficult = createDifficult(this.difficultInfo.normal, Difficulties.normal, this);
    normalDifficult.classList.add(AppCssClass.DIFFICULT_ACTIVE);

    const buttonPlay = document.createElement(AppTag.BUTTON);
    buttonPlay.classList.add(AppCssClass.BUTTON_BIG, AppCssClass.BUTTON);
    buttonPlay.innerText = this.PLAY_BUTTON_TEXT;
    buttonPlay.addEventListener('click', () => {
      startGame(this);
    });

    controlContainer.append(controlHeader, easyDifficult, normalDifficult, buttonPlay);

    return controlContainer;

    function createDifficult(
      features: { name: string; features: string[] },
      difficult: Difficulties,
      control: PreGameView
    ): HTMLElement {
      const difficultBlock = document.createElement(AppTag.BUTTON);
      difficulties.push(difficultBlock);
      difficultBlock.classList.add(AppCssClass.DIFFICULT);
      difficultBlock.addEventListener('click', toggleDifficult);

      difficultBlock.append(
        createDifficultHeader(features.name),
        creteDifficultFeatures(features.features)
      );

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

    //Переделать в роутинг
    function startGame(pregameView: PreGameView) {
      pregameView._component.remove();
      if (pregameView.gameType === GameType.solo) {
        document.body.append(new GameView(pregameView._board, pregameView.gameType).getComponent());
      }
    }
  }
}

export default PreGameView;
