abstract class View {
  protected _component!: Element;

  getComponent() {
    return this._component;
  }

  protected abstract createComponent(): void;
}

export default View;
