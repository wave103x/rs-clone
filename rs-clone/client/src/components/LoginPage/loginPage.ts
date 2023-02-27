import Server from '../Server/Server';
import AppAttribute from '../../enums/app-attribute';
import AppCssClass from '../../enums/app-css-class';
import AppEndPoint from '../../enums/app-endpoint';
import AppID from '../../enums/app-id';
import AppMethod from '../../enums/app-method';
import AppTag from '../../enums/app-tag';
import AppTextContent from '../../enums/app-text-content';
import AppType from '../../enums/app-type';
import View from '../Views/View';
import User from '../User/User';
import TUser from '../../types/TUser';

export default class LoginPage extends View {
  protected _component = document.createElement(AppTag.SECTION);
  private form = this.createBlock(AppTag.FORM, AppCssClass.REGISTRATION_FORM);
  private loginInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.LOGIN);
  private loginSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN);
  private passWordInput = this.createInput(
    AppCssClass.FORM_INPUT,
    AppType.PASSWORD,
    AppID.PASSWORD
  );
  private passWordSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN);
  private submitFormBtn = this.createBlock(AppTag.BUTTON, AppCssClass.BUTTON);
  private server: Server;
  private _user: User;

  constructor(server: Server, user: User) {
    super();
    this.createComponent();
    this.server = server;
    this._user = user;
  }

  handleForm() {
    this.loginSpan.innerHTML = '';
  }

  sendForm(event: Event) {
    event.preventDefault();
    if (this.form instanceof HTMLFormElement) {
      const dataObj = new FormData(this.form);
      this.server.signInUser(dataObj)
      .then((response) => {
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        switch (response) {
          case 402: {
            this.passWordSpan.innerHTML = 'Неверный пароль';
            break;
          }
          case 401: {
            this.loginSpan.innerHTML = 'Пользователь не найден';
            break;
          }
          default: {
            this.hide();
            // this._component.classList.add('hidden');
            if (response && typeof response !== 'number' && response.image) {
              this._user.update(response.nickName, response.id, response.image);
            }
            break;
          }
        }
      });
    }
  }
  protected createComponent(): void {
    this._component.classList.add(AppCssClass.REGISTRATION);
    this.form.setAttribute(AppAttribute.METHOD, AppMethod.POST);
    this.form.setAttribute(AppAttribute.ENCTYPE, AppAttribute.FORM_ENCTYPE);
    this.form.classList.add(AppCssClass.FORM);

    const closeIcon = new Image();
    closeIcon.src = require('../../assets/icons/close.svg') as string;
    closeIcon.className = 'close-icon';
    closeIcon.addEventListener('click', this.clonseHandler.bind(this));

    const loginBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.LOGIN,
      AppTextContent.LOGIN
    );

    const passwordBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.PASSWORD,
      AppTextContent.PASSWORD
    );

    loginBlock.append(this.loginSpan, this.loginInput);
    passwordBlock.append(this.passWordSpan, this.passWordInput);
    this.loginInput.addEventListener('input', () => this.handleForm());
    this.passWordInput.addEventListener('input', () => this.handleForm());

    this.submitFormBtn.classList.add(AppCssClass.BUTTON_BLUE);
    this.submitFormBtn.classList.add(AppCssClass.FORM_SUBMIT_BTN);
    this.submitFormBtn.setAttribute(AppAttribute.TYPE, AppType.SUBMIT);
    this.submitFormBtn.innerHTML = AppTextContent.SUBMIT;
    this.submitFormBtn.addEventListener('click', (event) => this.sendForm(event));
    this.form.append(loginBlock, passwordBlock, this.submitFormBtn, closeIcon);
    this._component.append(this.form);
  }

  private clonseHandler() {
    this.hide();
  }
}
