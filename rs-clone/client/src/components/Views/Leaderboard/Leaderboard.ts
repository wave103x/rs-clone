import LeaderSorts from '../../types/leadersSorts';
import View from '../View';
import Header from '../Header/Header';
import AppCssClass from '../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import './leaderboard.scss';

class Leaderboard extends View {
  private _header: Header;
  protected _component = document.createElement(AppTag.MAIN);
  private _table = document.createElement(AppTag.DIV);
  private _tempData: string[][];
  private _tempData2: string[][];
  private _currentSort: LeaderSorts = {};
  private _gameDifficlulty = document.createElement(AppTag.DIV);
  private _gameMode = document.createElement(AppTag.DIV);

  constructor(header: Header) {
    super();
    this._header = header;
    this.createComponent();
    this._header.setHeading('Таблица лидеров');

    this._tempData = [
      ['1', 'Igrok1', '21', '2:44', '3', 'Solo'],
      ['2', 'Igrok2', '21', '2:44', '3', 'Solo'],
      ['3', 'Igrok3', '21', '2:44', '3', 'Solo'],
      ['4', 'Igrok4', '21', '2:44', '3', 'Solo'],
      ['5', 'Igrok5', '21', '2:44', '3', 'Solo'],
      ['6', 'Igrok6', '21', '2:44', '3', 'Solo'],
    ];
    this._tempData2 = [
      ['1', 'Igrok1', '21', '2:44', '3', 'PVP'],
      ['2', 'Igrok2', '21', '2:44', '3', 'PVP'],
      ['3', 'Igrok3', '21', '2:44', '3', 'PVP'],
      ['4', 'Igrok4', '21', '2:44', '3', 'PVP'],
      ['5', 'Igrok5', '21', '2:44', '3', 'PVP'],
      ['1', 'Igrok6', '21', '2:44', '3', 'PVP'],
    ];

    this._tempData.forEach((elem) => {
      this.createRaw(elem);
    });
  }

  createRaw(data: string[]) {
    const line = document.createElement(AppTag.DIV);
    line.className = 'leader-table__line leader-table__line_body';
    data.forEach((elem) => {
      const cell = document.createElement(AppTag.DIV);
      cell.textContent = elem;
      cell.className = 'leader-table__cell';
      line.append(cell);
    });
    this._table.append(line);
  }

  protected createComponent(): void {
    this._component.className = 'wrapper-leaders';

    const controls = document.createElement(AppTag.DIV);
    controls.className = 'table-contols';

    this._gameMode = document.createElement(AppTag.DIV);
    this._gameMode.className = 'table-contols__line';
    const solo = this.createRadio('Solo', 'game-mode', 'solo', true);
    const pvp = this.createRadio('PVP', 'game-mode', 'pvp');
    this._gameMode.append(solo, pvp);

    this._gameDifficlulty = document.createElement(AppTag.DIV);
    this._gameDifficlulty.className = 'table-contols__line';
    const allDiffs = this.createRadio('Все режимы', 'game-difficulty', 'all', true);
    const easy = this.createRadio('Лёгкий', 'game-difficulty', 'easy');
    const classic = this.createRadio('Классика', 'game-difficulty', 'classic');
    const hard = this.createRadio('Особый', 'game-difficulty', 'hard');
    this._gameDifficlulty.append(allDiffs, easy, classic, hard);

    controls.append(this._gameMode, this._gameDifficlulty);

    this._table.className = 'leader-table';

    const tableHeadings = ['№', 'Игрок', 'Ходов', 'Время', 'Живых точек осталось', 'Режим'];

    const tableHeadDiv = document.createElement(AppTag.DIV);
    tableHeadDiv.className = 'leader-table__line_head leader-table__line';
    tableHeadings.forEach((elem) => {
      const cell = document.createElement(AppTag.DIV);
      cell.textContent = elem;
      cell.className = 'leader-table__head-cell';
      tableHeadDiv.append(cell);
    });

    this._component.append(controls, tableHeadDiv, this._table);
  }

  private createRadio(
    labelName: string,
    name: 'game-mode' | 'game-difficulty',
    value: string,
    checked?: boolean
  ) {
    const radio = document.createElement(AppTag.INPUT);
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', name);
    radio.setAttribute('value', value);
    if (checked) {
      radio.setAttribute('checked', 'true');
      this._currentSort[name] = value;
    }
    radio.className = 'controls-radio';
    const label = document.createElement(AppTag.LABEL);
    label.className = 'controls-label';
    label.textContent = labelName;

    radio.addEventListener('click', () => {
      this.radioHandler(name, value);
    });
    label.append(radio);

    return label;
  }

  private radioHandler(name: 'game-mode' | 'game-difficulty', value: string) {
    this._currentSort[name] = value;
    this._table.innerHTML = '';
    if (this._currentSort['game-mode'] === 'pvp') {
      this._gameDifficlulty.classList.add('line-disabled');
      this._currentSort['game-difficulty'] = '';
      this._tempData2.forEach((elem) => {
        this.createRaw(elem);
      });
    } else {
      this._gameDifficlulty.classList.remove('line-disabled');
      this._tempData.forEach((elem) => {
        this.createRaw(elem);
      });
    }
  }
}

export default Leaderboard;
