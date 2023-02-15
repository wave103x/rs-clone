import AbstractView from '../View';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import AccountMenus from '../../../enums/account-menus';
import './header.scss';
import AuthPage from '../../AuthPage/AuthPage';
import Server from '../../Server/Server';


class Header extends AbstractView {
  private readonly LOGO_MAIN = '../../../assets/icons/logo-main.svg';
  private readonly LOGO_LEADERS = '../../../assets/icons/leader-icon.svg';
  private readonly LOGO_PERSON = '../../../assets/icons/login-icon.svg';
  private readonly HASH = '#';
  private readonly LEADERS = 'leaders';
  private readonly LEADERS_RU = 'Лидеры';
  private readonly LOGIN = 'login';
  private readonly LOGIN_RU = 'Войти';
  private authPage: AuthPage;
  private server = new Server();
  private appMenu = document.createElement(AppTag.DIV);
  private loginBtn = this.createButton(this.LOGIN)
  protected _component = document.createElement(AppTag.HEADER);
  private _heading = document.createElement(AppTag.H2);


  constructor() {
    super();
    this.createComponent();
    this.authPage = new AuthPage()
  }
  renderRegistrationPage() {
    const main = document.querySelector('main')
    main?.append(this.authPage.getComponent())
    this._heading.className = AppCssClass.PAGE_HEADING;
  }

  setHeading(str: string, hide?: boolean): void {
    this._heading.textContent = str;
    this._heading.hidden = false;
    if (hide) this._heading.hidden = true;
  }

  protected createComponent(): void {
    this._component.classList.add(AppCssClass.HEADER, AppCssClass.WRAPPER);

    const link = document.createElement(AppTag.LINK);
    link.href = this.HASH;
    const logo = new Image();
    logo.src = require('../../../assets/icons/logo-main.svg') as string;
    logo.className = AppCssClass.LOGO;
    link.append(logo);

    this._heading.className = AppCssClass.PAGE_HEADING;
    this._heading.hidden = true;

    const buttons = document.createElement(AppTag.DIV);
    buttons.className = AppCssClass.HEADER_BUTTONS;
    this.loginBtn.addEventListener('click', () => this.renderRegistrationPage())
    buttons.append(this.createButton(this.LEADERS), this.loginBtn);

    this.createLoginDropMenu('wave103');

    this._component.append(link, this._heading, buttons, this.appMenu);
  }

  private createButton(type: 'leaders' | 'login'): HTMLElement {
    const btn = document.createElement(AppTag.BUTTON);
    btn.className = AppCssClass.HEADER_BTN;
    const svg = new Image();

    switch (type) {
      case this.LEADERS:
        btn.textContent = this.LEADERS_RU;
        svg.src = require('../../../assets/icons/leader-icon.svg') as string;
        break;
      case this.LOGIN:
        btn.textContent = this.LOGIN_RU;
        svg.src = require('../../../assets/icons/login-icon.svg') as string;

        btn.addEventListener('click', () => {
          this.renderRegistrationPage()
          // this.appMenu.classList.toggle(AppCssClass.ACC_MENU_HIDDEN);
        });
        break;
    }

    btn.append(svg);
    return btn;
  }

  private createLoginDropMenu(accName: string) {
    this.appMenu.classList.add(AppCssClass.ACC_MENU, AppCssClass.ACC_MENU_HIDDEN);

    const tempAccName = 'wave103';
    const menuPoints = Object.keys(AccountMenus).filter((elem) => isNaN(Number(elem)));
    menuPoints.unshift(tempAccName);

    for (let elem of menuPoints) {
      if (elem === accName) {
        const menuPoint = document.createElement(AppTag.P);
        menuPoint.textContent = elem;
        menuPoint.className = AppCssClass.ACC_MENU_NAME;
        this.appMenu.append(menuPoint);
        continue;
      }
      const menuPoint = document.createElement(AppTag.BUTTON);
      menuPoint.textContent = elem;
      menuPoint.className = AppCssClass.ACC_MENU_BTN;
      this.appMenu.append(menuPoint);
    }
  }
}

export default Header;
