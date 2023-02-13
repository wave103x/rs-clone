import AppEndPoint from "../utils/enums/app-endpoint";
import TUser from "../utils/types/TUser";

export default class Server {
  async postUser(formData:string): Promise<TUser | undefined> {
    const parsedObj = JSON.parse(formData);
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({login: parsedObj.login, nickName: parsedObj.nickName, password: parsedObj.password}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('No');
    }
  }
}