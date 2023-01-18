interface IBasicConfApi {
  baseUrl: URL,
  headers: HeadersInit
}

interface IConfApiFetch {
  method: methods,
  headers: HeadersInit,
}

interface IConfApiFetchBody extends IConfApiFetch {
  body: BodyInit
}

const enum methods {
  'GET' = 'GET',
  "POST" = "POST",
  'PATCH' = 'PATCH',
  'DELETE' = 'DELETE',
  'PUT' = 'PUT',
}

type FuncFetchId = {
  (id: number): Promise<string>
  (id: string): Promise<string>
}

type FuncFetchAvatar = {
  (id: string): Promise<string>
}

type FuncFetchNameLink = (name: string, link: URL) => Promise<string>
type FuncFetchNameAbout = (name: string, about: string) => Promise<string>
type FuncNoArgs = () => Promise<string>

class Api {
  private readonly _baseUrl: IBasicConfApi['baseUrl'];
  private readonly _headers: IBasicConfApi['headers']

  constructor({baseUrl, headers}: IBasicConfApi) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  public getUserInfo: FuncNoArgs = () => {
    const input: URL = new URL(`${this._baseUrl}/users/me`);

    const init: IConfApiFetch = {
      method: methods.GET,
      headers: this._headers
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public getCards: FuncNoArgs = () => {
    const input: URL = new URL(`${this._baseUrl}/cards`);

    const init: IConfApiFetch = {
      method: methods.GET,
      headers: this._headers
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public editUserInfo: FuncFetchNameAbout = (name, about) => {
    const input: URL = new URL(`${this._baseUrl}/users/me`);

    const init: IConfApiFetchBody = {
      method: methods.PATCH,
      headers: this._headers,
      body: JSON.stringify({name, about})
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public addCard: FuncFetchNameLink = (name, link) => {
    const input: URL = new URL(`${this._baseUrl}/cards`);

    const init: IConfApiFetchBody = {
      method: methods.POST,
      headers: this._headers,
      body: JSON.stringify({name, link})
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public deleteCard: FuncFetchId = (id) => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}`);

    const init: IConfApiFetch = {
      method: methods.DELETE,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public addLike: FuncFetchId = (id) => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}/likes`);

    const init: IConfApiFetch = {
      method: methods.PUT,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public deleteLike: FuncFetchId = (id) => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}/likes`);

    const init: IConfApiFetch = {
      method: methods.DELETE,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  public editAvatar: FuncFetchAvatar = (avatar) => {
    const input: URL = new URL(`${this._baseUrl}/users/me/avatar`);

    const init: IConfApiFetchBody = {
      method: methods.PATCH,
      headers: this._headers,
      body: JSON.stringify({avatar})
    }

    return fetch(input, init)
      .then((res) => this._checkResponse(res));
  }

  private _checkResponse = (res: Response): Promise<string> => {
    return !res.ok ? Promise.reject(res.json()) : res.json();
  }
}

export default Api;