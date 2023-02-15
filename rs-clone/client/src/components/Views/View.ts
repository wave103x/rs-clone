import AppAttribute from "../../enums/app-attribute";
import AppCssClass from "../../enums/app-css-class";
import AppTag from "../../enums/app-tag";

abstract class View {
  protected abstract _component: Element;

  getComponent() {
    if(this._component.classList.contains(AppCssClass.HIDDEN)) {
      this._component.classList.remove(AppCssClass.HIDDEN)
    }
    return this._component;
  }

  createBlock(element: string, className: string): Element {
    const elementToCreate = document.createElement(element);
    elementToCreate.classList.add(className);
    return elementToCreate;
  }

  createInput (
    className: string,
    type: string,
    name: string,
  ) {
    const input = this.createBlock(AppTag.INPUT, className);
    input.setAttribute(AppAttribute.TYPE, type)
    input.setAttribute(AppAttribute.NAME, name)
    return input
  }

  createInputBlock (
    blockTag: string,
    blockClass: string,
    id: string,
    textContent: string): Element {
    const inputBlock = this.createBlock(blockTag, blockClass);
    const label = this.createBlock(AppTag.LABEL, AppCssClass.FORM_LABEL);
    label.innerHTML = textContent;
    label.setAttribute(AppAttribute.FOR, id)
    inputBlock.append(label)
    return inputBlock;
  }

  protected abstract createComponent(): void;
}

export default View;
