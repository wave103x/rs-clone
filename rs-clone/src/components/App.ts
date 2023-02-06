import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';

class App {
  private _header = new Header();
  private _startView = new StartView();
  private _component = document.body;

  constructor() {
    this._component.append(this._header.getComponent(), this._startView.getComponent())
  }
}

export default App;
