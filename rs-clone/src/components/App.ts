import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import PreGameView from './Views/PreGameView/PreGameView';
import GameType from '../enums/game-type';

class App {
  private _header = new Header();
  //private _startView = new StartView();
  private _pregameView = new PreGameView(GameType.solo);
  private _component = document.body;

  constructor() {
    //this._component.append(this._header.getComponent(), this._startView.getComponent());
    this._component.append(this._header.getComponent(), this._pregameView.getComponent());

  }
}

export default App;
