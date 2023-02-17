import Header from '../Views/Header/Header';
import StartView from '../Views/StartView/StartView';
import PreGameView from '../Views/PreGameView/PreGameView';
import Leaderboard from '../Views/Leaderboard/Leaderboard';
import LoginPage from '../LoginPage/loginPage';
import AuthPage from '../AuthPage/AuthPage';
import GameType from '../../enums/game-type';
import User from '../User/User';
import Server from '../Server/Server';

export default class Routing {
  private _header: Header;
  private _startView: StartView;
  private _leaderboard: Leaderboard;
  private _authPage: AuthPage;
  private _loginPage: LoginPage;
  private _server: Server;
  private _user: User;

  constructor(
    header: Header,
    startView: StartView,
    leaders: Leaderboard,
    auth: AuthPage,
    login: LoginPage,
    server: Server,
    user: User
  ) {
    this._header = header;
    this._startView = startView;
    this._leaderboard = leaders;
    this._authPage = auth;
    this._loginPage = login;
    this._server = server;
    this._user = user;

    document.addEventListener('pageChange', this.changePages.bind(this));
  }

  private changePages(event: Event) {
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
        this._authPage.hide();
        this._loginPage.hide();
        break;
      case 'login':
        this._loginPage.hide();
        break;
      case 'auth':
        this._authPage.hide();
        break;
    }

    switch (event.detail.new) {
      case 'start':
        this._startView.show();
        this._header.setHeading('');
        break;
      case 'pregame-solo':
        document.body.append(
          new PreGameView(GameType.solo, this._server, this._user).getComponent()
        );
        this._header.setHeading('Против машины');
        break;
      case 'pregame-pvp':
        document.body.append(
          new PreGameView(GameType.online, this._server, this._user).getComponent()
        );
        this._header.setHeading('Против человека');
        break;
      case 'leaders':
        this._leaderboard.show();
        this._header.setHeading('Таблица лидеров');
        break;
      case 'login':
        this._loginPage.show();
        break;
      case 'auth':
        this._authPage.show();
        break;
    }
  }

  init() {
    this._leaderboard.hide();
    this._authPage.hide();
    this._loginPage.hide();
  }
}
