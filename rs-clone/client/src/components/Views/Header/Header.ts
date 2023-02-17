import AbstractView from '../View';
import AppCssClass from '../../../enums/app-css-class';
import AppTag from '../../../enums/app-tag';
import AccountMenus from '../../../enums/account-menus';
import './header.scss';
import AuthPage from '../../AuthPage/AuthPage';
import Server from '../../Server/Server';
import LoginPage from '../../LoginPage/loginPage';
import User from '../../User/User';


class Header extends AbstractView {
  private readonly LOGO_MAIN = '../../../assets/icons/logo-main.svg';
  private readonly LOGO_LEADERS = '../../../assets/icons/leader-icon.svg';
  private readonly LOGO_PERSON = '../../../assets/icons/login-icon.svg';
  private readonly HASH = '#';
  private readonly LEADERS = 'leaders';
  private readonly LEADERS_RU = 'Лидеры';
  private readonly LOGIN = 'login';
  private readonly SIGNUP = 'signUp';
  private readonly LOGOUT = 'logOut';
  private readonly LOGIN_RU = 'Войти';
  private readonly SIGNUP_RU = 'Регистрация';
  private readonly LOGOUT_RU = 'Выйти';
  private authPage: AuthPage;
  private loginPage: LoginPage;
  private server: Server;
  private id!: number;
  private appMenu = document.createElement(AppTag.DIV);
  private loginBtn = this.createButton(this.LOGIN)
  private signUpBtn = this.createButton(this.SIGNUP)
  private logOutBtn = this.createButton(this.LOGOUT)
  protected _component = document.createElement(AppTag.HEADER);
  private _heading = document.createElement(AppTag.H2);


  constructor(server: Server, user: User) {
    super();
    this.createComponent();
    this.server = server;
    this.authPage = new AuthPage(server, user)
    this.loginPage = new LoginPage(server, user)
    user.subscribe((name: string, id: number) => this.setName(name, id))
  }

  setName(name: string, id: number) {
    const svg = new Image();
    if(name) {
      this.id = id
      this.loginBtn.textContent = name;
      svg.src = require('../../../assets/icons/login-icon.svg') as string;
      this.loginBtn.append(svg)
      this.signUpBtn.classList.add(AppCssClass.HIDDEN)
      this.logOutBtn.classList.remove(AppCssClass.HIDDEN)
    } else {
      this.signUpBtn.classList.remove(AppCssClass.HIDDEN)
      this.logOutBtn.classList.add(AppCssClass.HIDDEN)
    }
  }
  renderLoginPage() {
    const main = document.querySelector('main')
    main?.append(this.loginPage.getComponent())
  }
  renderAuthPage() {
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
    this.loginBtn.addEventListener('click', () => this.renderLoginPage())
    this.signUpBtn.addEventListener('click', () => this.renderAuthPage())
    buttons.append(this.createButton(this.LEADERS), this.loginBtn, this.signUpBtn, this.logOutBtn);
    this.createLoginDropMenu('wave103');

    this._component.append(link, this._heading, buttons, this.appMenu);

  }

  private createButton(type: 'leaders' | 'login' | 'signUp' | 'logOut'): HTMLElement {
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
          // this.renderRegistrationPage()
          // this.appMenu.classList.toggle(AppCssClass.ACC_MENU_HIDDEN);
        });
        break;
      case this.SIGNUP:
        btn.textContent = this.SIGNUP_RU;
        svg.src = require('../../../assets/icons/login-icon.svg') as string;
        btn.addEventListener('click', () => {
          // this.renderRegistrationPage()
          // this.appMenu.classList.toggle(AppCssClass.ACC_MENU_HIDDEN);
        });
        break;
        case this.LOGOUT:
          btn.textContent = this.LOGOUT_RU;
          svg.src = require('../../../assets/icons/login-icon.svg') as string;
          btn.classList.add(AppCssClass.HIDDEN)
          btn.addEventListener('click', () => {
            this.server.logOut(this.id)
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
