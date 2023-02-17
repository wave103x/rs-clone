import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import Router from './Router/Router';
import AuthPage from './AuthPage/AuthPage';
import LoginPage from './LoginPage/loginPage';
import Leaderboard from './Views/Leaderboard/Leaderboard';
import User from './User/User';
import Server from './Server/Server';

class App {
  private _server = new Server();
  private _user = new User(this._server);
  private _authPage = new AuthPage(this._server, this._user);
  private _loginPage = new LoginPage(this._server, this._user);
  private _header = new Header(this._server, this._user);
  private _startView = new StartView();
  private _component = document.body;
  private _leaderboard = new Leaderboard(this._server);
  private _router = new Router(this._header, this._startView, this._leaderboard, this._authPage, this._loginPage);

  constructor() {
    this._component.append(
      this._header.getComponent(),
      this._startView.getComponent(),
      this._leaderboard.getComponent(),
      this._authPage.getComponent(),
      this._loginPage.getComponent(),
    );
    this._router.init();
    this._user.notify();

  }
}

export default App;
