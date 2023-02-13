import AppEndPoint from "../utils/enums/app-endpoint";
import TUser from "../utils/types/TUser";

export default class Server {
  async postUser(formData: string): Promise <TUser | undefined> {
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
}