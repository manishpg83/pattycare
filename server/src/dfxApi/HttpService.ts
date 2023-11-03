import axios from 'axios';
import { apiUrl } from '../common/config';
import { Params } from '../types';

export class HttpService {
  url_prefix: string;
  headers = {};

  constructor(url_prefix = '') {
    this.url_prefix = url_prefix;
    this.getHeaders();
  }

  getUrl(url: string) {
    return this.url_prefix + url;
  }

  addHeaders(headers: Params) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  getHeaders() {
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // if (this.checkSession()) {
    //     let apiToken = this.getSession().api_token
    //     this.headers = {
    //         ...this.headers,
    //         "Authorisation": `Bearer ${apiToken}`
    //     }
    // }
  }

  async get(url: string, queryParams?: Params) {
    try {
      let { status, data } = await axios({
        method: 'get',
        url: apiUrl + this.getUrl(url) + this.mapQueryParams(queryParams),
        headers: this.headers,
      });

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async post(url: string, body: Params, queryParams?: Params) {
    try {
      let { status, data } = await axios({
        method: 'post',
        url: apiUrl + this.getUrl(url) + this.mapQueryParams(queryParams),
        data: body,
        headers: this.headers,
      });

      if (status < 400) {
        return { status, data };
      }
    } catch (error: any) {
      const { status, data } = error.response;

      return { status, data };
    }
  }

  async patch(url: string, body: Params, queryParams?: Params) {
    try {
      let { status, data } = await axios({
        method: 'patch',
        url: apiUrl + this.getUrl(url) + this.mapQueryParams(queryParams),
        data: body,
        headers: this.headers,
      });

      if (status < 400) {
        return { status, data };
      }
    } catch (error: any) {
      const { status, data } = error.response;

      return { status, data };
    }
  }

  async put(url: string, body: Params, queryParams?: Params) {
    try {
      let response = await fetch(apiUrl + this.getUrl(url) + this.mapQueryParams(queryParams), {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body),
      });
      let jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(url: string, queryParams?: Params) {
    try {
      let response = await fetch(apiUrl + this.getUrl(url) + this.mapQueryParams(queryParams), {
        method: 'DELETE',
        headers: this.headers,
      });
      let jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // getSession() {
  //     let session = localStorage.getItem(SESSION_KEY)
  //     if (session) {
  //         return JSON.parse(session)
  //     }
  //     return session
  // }

  // checkSession() {
  //     return localStorage.getItem(SESSION_KEY) !== null
  // }

  mapQueryParams(queryParams?: Params) {
    return queryParams
      ? Object.keys(queryParams)
          .map(function (key) {
            return key + '=' + queryParams[key];
          })
          .join('&')
      : '';
  }
}
