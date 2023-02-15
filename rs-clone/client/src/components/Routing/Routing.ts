export default class Routing {
  private static _insance: Routing;
  root = '/';

  private constructor() {
    window.addEventListener('popstate', () => {
      console.log(window.history.state);
    });
    console.log(window.location.href);
    window.onload = () => {
      console.log('load')
    }
  }

  static getInstance() {
    if (Routing._insance) return Routing._insance
    else {
      this._insance = new Routing();
      return this._insance;
    }
  }

  startSoloGame() {
    history.pushState(1, 'Solo game', 'solo-game');
  }
}
