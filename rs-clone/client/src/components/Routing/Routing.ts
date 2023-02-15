export default class Routing {
  private static _insance: Routing;
  root = '/';

  private constructor() {

  }

  static getInstance() {
    if (Routing._insance) return Routing._insance;
    else {
      this._insance = new Routing();
      return this._insance;
    }
  }

  startSoloGame() {
    history.pushState(1, 'Solo game', 'solo-game');
  }
}
