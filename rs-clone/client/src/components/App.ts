import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import Router from './Router/Router';
import AuthPage from './AuthPage/AuthPage';
import Leaderboard from './Views/Leaderboard/Leaderboard';
import AppTag from '../enums/app-tag';
import User from './User/User';
import Server from './Server/Server';

class App {
  private _server = new Server();
  private _user = new User(this._server);
  // private _router = new Router();
  private _header = new Header(this._server, this._user);
  private _startView = new StartView();
  private _component = document.body;

  constructor() {
      const main = this._startView.createBlock(AppTag.MAIN, AppTag.MAIN);
      main.append(this._startView.getComponent());
      this._component.append(this._header.getComponent(), main);
      this._user.notify()

      // this._component.append(
      //   this._header.getComponent(),
      //   this._startView.getComponent(),
      //   this._leaderboard.getComponent()
      // );
      // this._router.init();
  }
}

export default App;
