import AbstractView from '../View';

import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';

import './win-view.scss';

class WinView extends AbstractView {
  protected _component = document.createElement(AppTag.DIV);

  private text: string;
  private readonly POSITION_TEXT = 'Ваш результат в таблице лидеров ';
  private readonly BUTTON_TEXT = 'Посмотреть';
  private readonly LINK_TEXT = 'В начало';

  //Добавить параметры статистики для запросов
  constructor(text: string) {
    super();
    this.text = text;
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.WIN);

    const title = document.createElement(AppTag.H2);
    title.classList.add(AppCssClass.WIN_TITLE);
    title.innerText = this.text;

    const link = document.createElement(AppTag.A);
    link.classList.add(AppCssClass.WIN_HOME);
    link.innerText = this.LINK_TEXT;
    link.setAttribute('src', '#');

    this._component.append(title, this.createPositionText(), this.createButton(), link);
  }

  private createPositionText(): HTMLElement {
    const text = document.createElement(AppTag.P);
    text.classList.add(AppCssClass.WIN_TEXT);
    text.innerHTML = this.POSITION_TEXT;

    //Запрос
    const position = undefined;

    const positionText = document.createElement(AppTag.SPAN);
    positionText.classList.add(AppCssClass.WIN_POSITION);
    positionText.innerText = `на ${position} месте`;

    text.append(positionText);
    return text;
  }

  private createButton(): HTMLElement {
    const button = document.createElement(AppTag.BUTTON);
    button.classList.add(AppCssClass.BUTTON, AppCssClass.BUTTON_BLUE);
    button.innerText = this.BUTTON_TEXT;
    //button.addEventListener();
    return button;
  }
}

export default WinView;
