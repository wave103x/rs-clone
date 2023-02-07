import View from "../View";
import Header from "../Header/Header";
import AppCssClass from "../enums/app-css-class";
import AppTag from "../enums/app-tag";
import './leaderboard.scss';

class Leaderboard extends View {
  private _header: Header;

  protected _component = document.createElement(AppTag.MAIN)
  constructor(header: Header) {
    super();
    this._header = header;

  }
  protected createComponent(): void {
    this._header.setHeading('Таблица лидеров');
  }
}

export default Leaderboard;