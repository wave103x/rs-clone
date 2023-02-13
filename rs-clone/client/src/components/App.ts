import Server from './Server/Server';
import AppTag from './utils/enums/app-tag';
import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';

class App {
  private _header = new Header();
  private _startView = new StartView();
  private _component = document.body;

  constructor() {
    // this._component.append(this._header.getComponent(), this._startView.getComponent())
  }

  start(): void {
    const main = this._startView.createBlock(AppTag.MAIN, AppTag.MAIN);
    main.append(this._startView.getComponent());
    this._component.append(this._header.getComponent(), main);
  }
}

export default App;
