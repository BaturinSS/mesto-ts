import {ICardInfo, IDataUser} from "./Card";

interface IBasicConfApi {
  baseUrl: URL,
  headers: HeadersInit
}

interface IConfApiFetch {
  method: methods,
  headers: IBasicConfApi['headers'],
}

interface IConfApiFetchBody extends IConfApiFetch {
  body: BodyInit
}

const enum methods {
  GET = 'GET',
  POST = "POST",
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface IDefaultMessage {
  message: string
}

type FuncFetchId = {
  (id: number): Promise<Response>
  (id: string): Promise<Response>
}

type FuncFetchAvatar = {
  (id: string): Promise<Response>
}

type FuncFetchNameLink = (name: string, link: URL) => Promise<Response>
type FuncFetchNameAbout = ({name, about}: { name: string, about: string }) => Promise<IDataUser>

class Api {
  private readonly _baseUrl: IBasicConfApi['baseUrl'];
  private readonly _headers: IBasicConfApi['headers']

  constructor({baseUrl, headers}: IBasicConfApi) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  public getCurrentUserInfo(): Promise<IDataUser> {
    const input: URL = new URL(`${this._baseUrl}/users/me`);

    const init: IConfApiFetch = {
      method: methods.GET,
      headers: this._headers
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public getCards = (): Promise<ICardInfo[]> => {
    const input: URL = new URL(`${this._baseUrl}/cards`);

    const init: IConfApiFetch = {
      method: methods.GET,
      headers: this._headers
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public editUserInfo = ({name, about}: IDataUser): Promise<IDataUser> => {
    const input: URL = new URL(`${this._baseUrl}/users/me`);

    const init: IConfApiFetchBody = {
      method: methods.PATCH,
      headers: this._headers,
      body: JSON.stringify({name, about})
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public addCard = ({name, link}: ICardInfo): Promise<ICardInfo> => {
    const input: URL = new URL(`${this._baseUrl}/cards`);

    const init: IConfApiFetchBody = {
      method: methods.POST,
      headers: this._headers,
      body: JSON.stringify({name, link})
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public deleteCard = (id: string | number): Promise<void> => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}`);

    const init: IConfApiFetch = {
      method: methods.DELETE,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public addLike = (id: number | string): Promise<ICardInfo> => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}/likes`);

    const init: IConfApiFetch = {
      method: methods.PUT,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public deleteLike = (id: number | string): Promise<ICardInfo> => {
    const input: URL = new URL(`${this._baseUrl}/cards/${id}/likes`);

    const init: IConfApiFetch = {
      method: methods.DELETE,
      headers: this._headers,
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  public editAvatar = ({avatar}: IDataUser): Promise<IDataUser> => {
    const input: URL = new URL(`${this._baseUrl}/users/me/avatar`);

    const init: IConfApiFetchBody = {
      method: methods.PATCH,
      headers: this._headers,
      body: JSON.stringify({avatar})
    }

    return fetch(input, init)
      .then((res: Response) => this._checkResponse(res));
  }

  private _checkResponse<T>(res: Response): Promise<T> {
    return res.ok
      ? res.json()
      : res.json().then((res: { message: string }) => Promise.reject(res.message))
  }
}

export default Api;
