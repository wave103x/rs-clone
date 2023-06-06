import TUser from "../../types/TUser";
import Server from "../Server/Server";

export default class User {
  private _nickName!: string;
  private _id!: number;
  private _image!: string | undefined;
  private _subscribers = new Array<Function>()
  constructor(server: Server) {
    server.getCurrentUser()
    .then((response: TUser | undefined) => {
      if(!response) {
        this._nickName = '';
        this._id = -1;
        this._image = '';
      } else {
        this._nickName = response.nickName;
        this._id = response.id;
        this._image = response.image;
      }
      this.notify();
    })
  }
  update(nickName: string, id: number, image: string) {
    this._nickName = nickName;
    this._id = id;
    this._image = image;
    this.notify();
  };

  getNickName() {
    return this._nickName;
  };

  getId() {
    return this._id;
  };
  getImage() {
    return this._image;
  };
  notify() {
    this._subscribers.forEach((method) => {
      method(this._nickName, this._id, this._image);
    });
  }
//если подписчики появятся позже, метод не сработает
  subscribe(method:Function) {
    this._subscribers.push(method);
  };
}