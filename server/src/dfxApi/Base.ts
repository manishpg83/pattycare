import { Params } from '../types';
import { HttpService } from './HttpService';

export class Base {
  http;

  constructor(url_prefix = '') {
    this.http = new HttpService(url_prefix);
  }

  addHeaders(headers: Params) {
    this.http.addHeaders(headers);
  }

  async getAll(path: string) {
    return await this.http.get(`${path}`);
  }

  async get(path: string, id: string) {
    return await this.http.get(`${path}/${id}`);
  }

  async post(path: string, body: Params) {
    return await this.http.post(`${path}`, body);
  }

  async patch(path: string, body: Params) {
    return await this.http.patch(`${path}`, body);
  }

  async put(path: string, id: string, body: Params) {
    return await this.http.put(`${path}/${id}`, body);
  }

  async delete(path: string, id: string) {
    return await this.http.remove(`${path}/${id}`);
  }
}
