import AbstractView from '../View';
import events from '../../../enums/events';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import './win-view.scss';

class WinView extends AbstractView {
  protected _component = document.createElement(AppTag.DIV);

  private text: string;
  private record: boolean;
  private position: number;

  private readonly POSITION_TEXT = 'Ваш результат в таблице лидеров ';
  private readonly LOOSE_TEXT = 'Ну, бывает...';
  private readonly WIN_TEXT = 'В прошлый раз ты был удачливее.';
  private readonly BUTTON_TEXT = 'Посмотреть';
  private readonly LINK_TEXT = 'В начало';
  private readonly EVENT_CLICK = 'click';

  constructor(text: string, record: boolean, position: number) {
    super();
    this.position = position;
    this.record = record;

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
    link.addEventListener(this.EVENT_CLICK, (event) => {
      event?.preventDefault();
      document.dispatchEvent(
        new CustomEvent(events.pageChange, {
          detail: {
            old: 'any',
            new: 'start',
          },
        })
      );
    });

    this._component.append(title);

    if (this.record) {
      this._component.append(this.createPositionText());
    } else {
      const text = document.createElement(AppTag.P);
      text.classList.add(AppCssClass.WIN_TEXT, AppCssClass.WIN_TEXT_LOSE);
      text.textContent = this.text === 'Поражение!' ? this.LOOSE_TEXT : this.WIN_TEXT;

      this._component.append(text);
    }

    this._component.append(this.createButton(), link);
  }

  private createPositionText(): HTMLElement {
    const text = document.createElement(AppTag.P);
    text.classList.add(AppCssClass.WIN_TEXT);
    text.innerHTML = this.POSITION_TEXT;

    const positionText = document.createElement(AppTag.SPAN);
    positionText.classList.add(AppCssClass.WIN_POSITION);
    positionText.innerText = `на ${this.position} месте`;

    text.append(positionText);
    return text;
  }

  private createButton(): HTMLElement {
    const button = document.createElement(AppTag.BUTTON);
    button.classList.add(AppCssClass.BUTTON, AppCssClass.BUTTON_BLUE);
    button.innerText = this.BUTTON_TEXT;
    button.addEventListener(this.EVENT_CLICK, () => {
      document.dispatchEvent(
        new CustomEvent(events.pageChange, {
          detail: {
            old: 'any',
            new: 'leaders',
          },
        })
      );
    });
    return button;
  }
}

export default WinView;
