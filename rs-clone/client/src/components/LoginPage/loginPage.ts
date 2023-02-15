import Server from "../Server/Server";
import AppAttribute from "../utils/enums/app-attribute";
import AppCssClass from "../utils/enums/app-css-class";
import AppEndPoint from "../utils/enums/app-endpoint";
import AppID from "../utils/enums/app-id";
import AppMethod from "../utils/enums/app-method";
import AppTag from "../utils/enums/app-tag";
import AppTextContent from "../utils/enums/app-text-content";
import AppType from "../utils/enums/app-type";
import View from "../Views/View";

export default class LoginPage extends View {
  protected _component = document.createElement(AppTag.SECTION);
  private form = this.createBlock(AppTag.FORM, AppCssClass.REGISTRATION_FORM);
  private loginInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.LOGIN);
  private loginSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN)
  private passWordInput = this.createInput(AppCssClass.FORM_INPUT, AppType.PASSWORD, AppID.PASSWORD)
  private passWordSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN)
  private submitFormBtn = this.createBlock(AppTag.BUTTON, AppCssClass.BUTTON);
  private server:Server;
  constructor() {
    super();
    this.createComponent();
    this.server = new Server();
  }

  handleForm() {
    this.loginSpan.innerHTML = "";
  }

  sendForm(event: Event) {
    event.preventDefault()
    if(this.form instanceof HTMLFormElement) {
      const dataObj = JSON.stringify(Object.fromEntries(new FormData(this.form)));
      this.server.signInUser(dataObj)
      .then((response) => {
        switch (response) {
          case 400: {
            this.passWordSpan.innerHTML = "Неверный пароль"
            break;
          }
          case 401: {
            this.loginSpan.innerHTML = "Пользователь не найден"
            break;
          }
          default: {
              this._component.classList.add('hidden')
              break;
          }

        }
      })
    }
  }
  protected createComponent(): void {
    this._component.classList.add(AppCssClass.REGISTRATION)
    this.form.setAttribute(AppAttribute.METHOD, AppMethod.POST);
    this.form.setAttribute(AppAttribute.ENCTYPE, AppAttribute.FORM_ENCTYPE);
    this.form.classList.add(AppCssClass.FORM);

    const loginBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.LOGIN,
      AppTextContent.LOGIN
    )

    const passwordBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.PASSWORD,
      AppTextContent.PASSWORD
    )

    loginBlock.append(this.loginSpan, this.loginInput)
    passwordBlock.append(this.passWordSpan, this.passWordInput)
    this.loginInput.addEventListener('input', () => this.handleForm())
    this.passWordInput.addEventListener('input', () => this.handleForm())

      
    this.submitFormBtn.classList.add(AppCssClass.BUTTON_BLUE)
    this.submitFormBtn.classList.add(AppCssClass.FORM_SUBMIT_BTN)
    this.submitFormBtn.setAttribute(AppAttribute.TYPE, AppType.SUBMIT)
    this.submitFormBtn.innerHTML = AppTextContent.SUBMIT;
    this.submitFormBtn.addEventListener('click', (event) => this.sendForm(event))
    this.form.append(loginBlock, passwordBlock, this.submitFormBtn)
    this._component.append(this.form)
  }
}