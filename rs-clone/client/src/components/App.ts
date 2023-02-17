import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import Routing from './Router/Router';
import AuthPage from './AuthPage/AuthPage';
import Leaderboard from './Views/Leaderboard/Leaderboard';
import AppTag from '../enums/app-tag';

class App {
  private _header = new Header();
  private _startView = new StartView();
  private _auth = new AuthPage();
  private _leaderboard = new Leaderboard();
  private _router = new Routing(this._header, this._startView, this._leaderboard);
  private _component = document.body;

  constructor() {
    this._component.append(
      this._header.getComponent(),
      this._startView.getComponent(),
      this._leaderboard.getComponent()
    );
    this._router.init();
    // const main = this._startView.createBlock(AppTag.MAIN, AppTag.MAIN);
    // main.append(this._startView.getComponent());
    // this._component.append(this._header.getComponent(), main);

    // this._component.append(this._header.getComponent(), this._pregameView.getComponent());
    // this._component.append(this._header.getComponent(), this._auth.getComponent());
  }
}

export default App;
