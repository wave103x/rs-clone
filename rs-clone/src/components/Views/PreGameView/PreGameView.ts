import AbstractView from '../View';
import AppCssClass from '../enums/app-css-class';
import AppTag from '../enums/app-tag';
import './pregame-view.scss';
import Difficulties from '../enums/difficulties';

class PreGameView extends AbstractView {
  //private _board = new Board();
  protected _component = document.createElement(AppTag.DIV);

  private difficult: string = Difficulties.normal;

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

  constructor() {
    super();
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.PREGAME);

    this._component.append(this.createBoardContainer(), this.createControlPanel());
  }

  private createBoardContainer(): HTMLElement {
    const container = document.createElement(AppTag.DIV);
    container.classList.add(AppCssClass.BOARD_CONTAINER);

    const shuffleButton = document.createElement(AppTag.BUTTON);
    shuffleButton.classList.add(AppCssClass.BUTTON);
    shuffleButton.innerText = this.SHUFFLE_BUTTON_TEXT;
    // shuffleButton.addEventListener("click", () => {
    //   this._board.shuffle();
    // });

    const buttonText = document.createElement(AppTag.P);
    buttonText.classList.add(AppCssClass.BOARD_CONTAINER_TEXT);
    buttonText.innerText = this.SHUFFLE_TEXT;

    container.append(shuffleButton, buttonText);

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
    //buttonPlay.addEventListener();

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
  }
}

export default PreGameView;
