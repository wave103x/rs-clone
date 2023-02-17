import TUser from "../../types/TUser";
import Server from "../Server/Server";

export default class User {
  private _nickName!: string;
  private _id!: number;
  private _subscribers = new Array<Function>()
  constructor(server: Server) {
    server.getCurrentUser()
    .then((response: TUser | undefined) => {
      if(!response) {
        this._nickName = '';
        this._id = -1
      } else {
        this._nickName =response.nickName;
        this._id =response.id;
      }
      this.notify();
    })
  }
  update(nickName: string, id: number) {
    this._nickName = nickName;
    this._id = id;
    this.notify();
  };

  getNickName() {
    return this._nickName;
  };

  getId() {
    return this._id;
  };
  notify() {
    this._subscribers.forEach((method) => {
      method(this._nickName, this._id);
    });
  }
//если подписчики появятся позже, метод не сработает
  subscribe(method:Function) {
    this._subscribers.push(method);
  };
}