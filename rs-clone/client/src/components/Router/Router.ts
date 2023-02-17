import Header from '../Views/Header/Header';
import StartView from '../Views/StartView/StartView';
import PreGameView from '../Views/PreGameView/PreGameView';
import Leaderboard from '../Views/Leaderboard/Leaderboard';
import GameType from '../../enums/game-type';

export default class Routing {
  private _header: Header;
  private _startView: StartView;
  private _leaderboard: Leaderboard;

  constructor(header: Header, startView: StartView, leaders: Leaderboard) {
    this._header = header;
    this._startView = startView;
    this._leaderboard = leaders;

    document.addEventListener('pageChange', (event) => {
      console.log(1)
      if (!(event instanceof CustomEvent)) return;
      switch (event.detail.old) {
        case 'start':
          this._startView.hide();
          break;
        case 'pregame':
          break;
        case 'any':
          this._leaderboard.hide();
          this._startView.hide();
          const game = document.querySelector('.game');
          game?.remove();
          const pregame = document.querySelector('.pregame');
          pregame?.remove();
          break;
      }

      switch (event.detail.new) {
        case 'start':
          this._startView.show();
          this._header.setHeading('');
          break;
        case 'pregame-solo':
          document.body.append(new PreGameView(GameType.solo).getComponent());
          this._header.setHeading('Против машины');
          break;
        case 'pregame-pvp':
          document.body.append(new PreGameView(GameType.online).getComponent());
          this._header.setHeading('Против человека');
          break;
        case 'leaders':
          this._leaderboard.show();
          this._header.setHeading('Таблица лидеров');
          break;
      }
    });
  }
  init() {
    this._leaderboard.hide();
  }
}
