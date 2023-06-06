import View from '../View';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import './start-view.scss';

class StartView extends View {
  private readonly PVP = 'pvp';
  private readonly SOLO = 'solo';
  private readonly MAIN_HEADING = 'Морской бой';
  private readonly BUTTON_NAME_SOLO = 'Против машины';
  private readonly BUTTON_NAME_PVP = 'Против человека';
  private readonly EVENT_CLICK = 'click';
  protected _component = document.createElement(AppTag.DIV);
  private _leftBtn = this.createBtn(this.SOLO);

  constructor() {
    super();
    this.createComponent();
  }

  protected createComponent(): void {
    this._component.className = AppCssClass.FIRST_VIEW;
    const h1 = document.createElement(AppTag.H1);
    h1.textContent = this.MAIN_HEADING;
    h1.className = AppTag.H1;
    const logo = new Image();
    logo.src = require('../../../assets/icons/logo-main.svg') as string;
    logo.className = AppCssClass.FIRST_VIEW_LOGO;

    this._leftBtn = this.createBtn(this.SOLO);
    const rightBtn = this.createBtn(this.PVP);

    this._leftBtn.addEventListener(this.EVENT_CLICK, this.toSoloGameBtnHandler.bind(this))
    // rightBtn.addEventListener(this.EVENT_CLICK, this.toPVPGameBtnHandler.bind(this))
    const buttons = document.createElement(AppTag.DIV);

    buttons.className = AppCssClass.FIRST_VIEW_BUTTONS;
    buttons.append(this._leftBtn, rightBtn);

    this._component.append(h1, logo, buttons);
  }

  private toSoloGameBtnHandler() {
    document.dispatchEvent(new CustomEvent('pageChange', {
      detail: {
        old: 'start',
        new: 'pregame-solo',
      }
    }))
  }
  private toPVPGameBtnHandler() {
    document.dispatchEvent(new CustomEvent('pageChange', {
      detail: {
        old: 'start',
        new: 'pregame-pvp',
      }
    }))
  }

  private createBtn(type: 'solo' | 'pvp'): HTMLDivElement {
    const img = new Image();
    const btn = document.createElement(AppTag.BUTTON);
    btn.classList.add(AppTag.BUTTON, AppCssClass.BUTTON_BIG);

    const div = document.createElement(AppTag.DIV);
    div.className = AppCssClass.BUTTON_DIV;

    switch (type) {
      case this.SOLO:
        btn.textContent = this.BUTTON_NAME_SOLO;
        img.src = require('../../../assets/icons/solo.svg') as string;
        img.classList.add(AppCssClass.BUTTON_DIV_IMG, AppCssClass.BUTTON_DIV_IMG_LEFT);
        break;
      case this.PVP:
        btn.textContent = this.BUTTON_NAME_PVP;
        btn.classList.add(AppCssClass.BUTTON_DISABLED);
        img.src = require('../../../assets/icons/pvp.svg') as string;
        img.classList.add(AppCssClass.BUTTON_DIV_IMG, AppCssClass.BUTTON_DIV_IMG_RIGHT);
        break;
    }
    div.append(btn, img);
    return div;
  }

  lockBtn() {
    this._leftBtn.classList.add(AppCssClass.BUTTON_DISABLED);
  }
  unlockBtn() {
    this._leftBtn.classList.remove(AppCssClass.BUTTON_DISABLED);
  }
}

export default StartView;
