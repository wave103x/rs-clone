import LeaderSorts from '../../../types/leadersSorts';
import View from '../View';
import Header from '../Header/Header';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import './leaderboard.scss';
import Server from '../../Server/Server';
import GameType from '../../../enums/game-type';
import TWinnerObj from '../../../types/TWinnerObj';


class Leaderboard extends View {
  protected _component = document.createElement(AppTag.DIV);
  private _table = document.createElement(AppTag.DIV);
  private _currentSort: LeaderSorts = {};
  private _gameDifficlulty = document.createElement(AppTag.DIV);
  private _gameMode = document.createElement(AppTag.DIV);
  private _server: Server;

  constructor(server: Server) {
    super();
    this._server = server;
    this.createComponent();

    this._server.getWinnersByMode(GameType.solo).then((res) => {
      if (typeof res !== 'number' && typeof res !== 'undefined') {
        res.forEach((elem, index) => this.createRaw(elem, index));
      }
    });
  }

  createRaw(data: TWinnerObj, number: number) {
    const line = document.createElement(AppTag.DIV);
    line.className = 'leader-table__line leader-table__line_body';

    const num = document.createElement(AppTag.DIV);
    num.textContent = number.toString();
    num.className = 'leader-table__cell';

    const player = document.createElement(AppTag.DIV);
    player.textContent = data.user?.nickName || 'player';
    player.className = 'leader-table__cell';

    const turns = document.createElement(AppTag.DIV);
    turns.textContent = data.score.toString();
    turns.className = 'leader-table__cell';

    const time = document.createElement(AppTag.DIV);
    time.textContent = data.time.toString();
    time.className = 'leader-table__cell';

    const aliveCells = document.createElement(AppTag.DIV);
    aliveCells.textContent = data.aliveCells.toString();
    aliveCells.className = 'leader-table__cell';

    const mode = document.createElement(AppTag.DIV);
    mode.textContent = data.mode.toString();
    mode.className = 'leader-table__cell';


    line.append(num, player, turns, time, aliveCells, mode);
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

    switch (this._currentSort['game-mode']) {
      case 'pvp':
        this._server.getWinnersByMode(GameType.online).then((res) => {
          if (typeof res !== 'number' && typeof res !== 'undefined') {
            res.forEach((elem, index) => this.createRaw(elem, index));
          }
        });
        this._gameDifficlulty.classList.add('line-disabled')
        break;
      case 'solo':
        this._server.getWinnersByMode(GameType.solo).then((res) => {
          if (typeof res !== 'number' && typeof res !== 'undefined') {
            res.forEach((elem, index) => this.createRaw(elem, index));
          }
        });
        this._gameDifficlulty.classList.remove('line-disabled')

    }
  }
}

export default Leaderboard;
