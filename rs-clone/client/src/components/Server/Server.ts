import AppEndPoint from "../../enums/app-endpoint";
import TUser from "../../types/TUser";
import TWinnerObj from "../../types/TWinnerObj";
import User from "../User/User";
import Header from "../Views/Header/Header";

export default class Server {

  async postUser(formData: FormData): Promise <TUser | number | undefined> {
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.SIGNUP}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data: TUser = await response.json();
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
  async signInUser(formData: FormData): Promise <TUser | number | undefined> {

    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.SIGNIN}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      return await response.json()
      .then((data:TUser) => {
        switch (response.status) {
          case 201: {
            console.log('201 OK');
            return data;
          }
          case 402: {
            console.log('400 Неверный пароль');
            return response.status;
          }
          case 401: {
            console.log('Логин не найден');
            return response.status;
          }
        }
        // return;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async logOut(id:number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: headers,
    }
    try {
      const response: Response = await fetch(`${AppEndPoint.HOST + AppEndPoint.LOGOUT + `/${id}`}`, options);

      return response
    } catch (error) {

    }
  }
  async getCurrentUser() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: headers,
    }
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.GETUSER}`, options);
      const data = await response.json()
      return data
    } catch (error) {

    }
  }

  async postWinner(dataObj: TWinnerObj): Promise <TWinnerObj | number | undefined> {
    const formData = new FormData()
    formData.append('score', dataObj.score.toString())
    formData.append('time', dataObj.time.toString())
    formData.append('aliveCells', dataObj.aliveCells.toString())
    formData.append('mode', dataObj.mode.toString())
    try {
      const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.POSTWINNER + dataObj.userId}`, {
        method: 'POST',
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
          console.log('400 Что-то не так');
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
async getWinnersByMode(mode: string): Promise <TWinnerObj[] | number | undefined> {
  try {
    const response = await fetch(`${AppEndPoint.HOST + AppEndPoint.POSTWINNER + mode}`)
    const data = await response.json();
    switch (response.status) {
      case 201: {
        console.log('201 OK');
        return data;
      }
      case 400: {
        console.log('400 Что-то не так');
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