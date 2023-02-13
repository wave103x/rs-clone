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

export default class AuthPage extends View {
  protected _component = document.createElement(AppTag.SECTION);
  private form = this.createBlock(AppTag.FORM, AppCssClass.REGISTRATION_FORM);
  private loginInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.USER_NAME);
  private nickNameInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.NICK_NAME)
  private passWordInput = this.createInput(AppCssClass.FORM_INPUT, AppType.PASSWORD, AppID.PASSWORD)
  private imageInput = this.createInput(AppCssClass.FORM_INPUT, AppType.FILE, AppID.IMAGE)
  private submitFormBtn = this.createBlock(AppTag.BUTTON, AppCssClass.BUTTON);
  private server:Server;
  constructor() {
    super();
    this.createComponent();
    this.server = new Server();
  }

  sendForm(event: Event) {
    event.preventDefault()

    if(this.form instanceof HTMLFormElement) {
      const dataObj = JSON.stringify(Object.fromEntries(new FormData(this.form)));
      this.server.postUser(dataObj)
    }
  }
  protected createComponent(): void {
    this._component.classList.add(AppCssClass.REGISTRATION)
    this.form.setAttribute(AppAttribute.ACTION, AppEndPoint.SIGNUP);
    this.form.setAttribute(AppAttribute.METHOD, AppMethod.POST);
    this.form.setAttribute(AppAttribute.ENCTYPE, AppAttribute.FORM_ENCTYPE);
    this.form.classList.add(AppCssClass.FORM);

    const loginBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.USER_NAME,
      AppTextContent.LOGIN
    )

    const nickNameBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.NICK_NAME,
      AppTextContent.NICK_NAME
    )
    const passwordBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.PASSWORD,
      AppTextContent.PASSWORD
    )
    const fileLoadBlock = this.createBlock(AppTag.FORM, AppCssClass.FORM_INPUT_BLOCK)

    const imageLabelSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_LABEL);
    imageLabelSpan.classList.add(AppCssClass.IMAGE_LABEL)
    imageLabelSpan.innerHTML = AppTextContent.AVATAR

    const imageBtnSpan = this.createBlock(AppTag.SPAN, AppCssClass.BUTTON_BLUE);
    imageBtnSpan.classList.add(AppCssClass.FORM_FILE_BTN)
    imageBtnSpan.classList.add(AppCssClass.BUTTON)
    imageBtnSpan.innerHTML = AppTextContent.CHOOSE_AVATAR

    loginBlock.append(this.loginInput)
    nickNameBlock.append(this.nickNameInput)
    passwordBlock.append(this.passWordInput)
    fileLoadBlock.append(imageLabelSpan, imageBtnSpan, this.imageInput)

    this.submitFormBtn.classList.add(AppCssClass.BUTTON_BLUE)
    this.submitFormBtn.classList.add(AppCssClass.FORM_SUBMIT_BTN)
    this.submitFormBtn.setAttribute(AppAttribute.TYPE, AppType.SUBMIT)
    this.submitFormBtn.innerHTML = AppTextContent.SUBMIT;
    this.submitFormBtn.addEventListener('click', (event) => this.sendForm(event))
    this.form.append(loginBlock, nickNameBlock, passwordBlock, fileLoadBlock, this.submitFormBtn)
    this._component.append(this.form)
  }
}