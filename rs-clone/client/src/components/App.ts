import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import PreGameView from './Views/PreGameView/PreGameView';
import GameType from '../enums/game-type';
import Routing from './Routing/Routing';
import AuthPage from './AuthPage/AuthPage';
import AppTag from '../enums/app-tag';

class App {
  private _router = Routing.getInstance();
  private _header = new Header();
  private _startView = new StartView(this._router);
  private _pregameView = new PreGameView(GameType.solo);
  private _auth = new AuthPage();
  private _component = document.body;

  constructor() {
      const main = this._startView.createBlock(AppTag.MAIN, AppTag.MAIN);
      main.append(this._startView.getComponent());
      this._component.append(this._header.getComponent(), main);

    // this._component.append(this._header.getComponent(), this._startView.getComponent());
    // this._component.append(this._header.getComponent(), this._pregameView.getComponent());
    // this._component.append(this._header.getComponent(), this._auth.getComponent());
  }
}

export default App;
