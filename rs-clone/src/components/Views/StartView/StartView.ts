import View from '../View';
import AppCssClass from '../enums/app-css-class';
import AppTag from '../enums/app-tag';
import './start-view.scss';

class StartView extends View {
  private readonly PVP = 'pvp';
  private readonly SOLO = 'solo';
  private readonly MAIN_HEADING = 'Морской бой';
  private readonly LOGO_MAIN_PATH = '../../../assets/icons/logo-main.svg';
  private readonly LOGO_SOLO_PATH = '../../../assets/icons/solo.svg';
  private readonly LOGO_PVP_PATH = '../../../assets/icons/pvp.svg';
  private readonly BUTTON_NAME_SOLO = 'Против машины';
  private readonly BUTTON_NAME_PVP = 'Против человека';

  constructor() {
    super();
    this.createComponent();
  }

  getComponent() {
    return this._component;
  }

  protected createComponent() {
    this._component = document.createElement(AppTag.DIV);
    this._component.className = AppCssClass.FIRST_VIEW;
    const h1 = document.createElement(AppTag.H1);
    h1.textContent = this.MAIN_HEADING;
    h1.className = AppTag.H1;
    const logo = new Image();
    logo.src = require('../../../assets/icons/logo-main.svg') as string;
    logo.className = AppCssClass.FIRST_VIEW_LOGO;

    const leftBtn = this.createBtn(this.SOLO);
    const rightBtn = this.createBtn(this.PVP);
    const buttons = document.createElement(AppTag.DIV);

    buttons.className = AppCssClass.FIRST_VIEW_BUTTONS;
    buttons.append(leftBtn, rightBtn);

    this._component.append(h1, logo, buttons);
  }

  private createBtn(type: 'solo' | 'pvp') {
    const img = new Image();
    const btn = document.createElement(AppTag.BUTTON);
    btn.classList.add(AppTag.BUTTON, AppCssClass.BUTTON_BIG);

    const div = document.createElement(AppTag.DIV);
    div.className = AppCssClass.BUTTON_DIV;

    switch (type) {
      case this.SOLO:
        btn.textContent = this.BUTTON_NAME_SOLO;
        img.src = require('../../../assets/icons/solo.svg') as string; //не заводится с конст-ми
        img.classList.add(AppCssClass.BUTTON_DIV_IMG, AppCssClass.BUTTON_DIV_IMG_LEFT);
        break;
      case this.PVP:
        btn.textContent = this.BUTTON_NAME_PVP;
        img.src = require('../../../assets/icons/pvp.svg') as string;
        img.classList.add(AppCssClass.BUTTON_DIV_IMG, AppCssClass.BUTTON_DIV_IMG_RIGHT);
        break;
    }
    div.append(btn, img);
    return div;
  }
}

export default StartView;
