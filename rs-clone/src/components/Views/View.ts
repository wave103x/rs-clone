abstract class View {
  protected abstract _component: Element;

  getComponent() {
    return this._component;
  }

  protected abstract createComponent(): void;
}

export default View;
