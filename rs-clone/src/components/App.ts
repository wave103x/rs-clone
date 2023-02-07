import Header from './Views/Header/Header';
import StartView from './Views/StartView/StartView';
import Leaderboard from './Views/Leaderboard/Leaderboard';

class App {
  private _header = new Header();
  private _startView = new StartView();
  private _leaders = new Leaderboard(this._header);
  private _component = document.body;

  constructor() {
    this._component.append(this._header.getComponent(), this._leaders.getComponent())
  }
}

export default App;
