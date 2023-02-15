import AppEndPoint from "../../enums/app-endpoint";
import TUser from "../../types/TUser";

export default class Server {
  async postUser(formData: string): Promise <TUser | number | undefined> {
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
      switch (response.status) {
        case 201: {
          console.log('201 OK');
          return data;
        }
        case 400: {
          console.log('400 Bad request');
          return response.status;
        }
        case 401: {
          console.log('401 Login is already exists');
          return response.status;
        }
        case 403: {
          console.log('403 Nickname is already exists');
          return response.status;
        }
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
  async signInUser(formData: string): Promise <TUser | number | undefined> {
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.SIGNIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      switch (response.status) {
        case 201: {
          console.log('201 OK');
          return data;
        }
        case 400: {
          console.log('400 Неверный пароль');
          return response.status;
        }
        case 401: {
          console.log('Логин не найден');
          return response.status;
        }
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
}