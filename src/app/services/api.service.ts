import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as md5 from "md5";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'https://jcocmusic.herokuapp.com/api/'
  headers = new HttpHeaders();

  constructor(
    private httpClt: HttpClient
  ) { 
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

  login(user, pass) {
    return new Promise((resolve, reject) => {
      const body = {
        username: user,
        password: md5(pass)
      };
      this.httpClt.post(this.apiUrl + 'login', body, {headers: this.headers}).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      );
    });
  }

  async getListData(url, page_size?, page_number?, order_by?, sort_by?, search?) {
    return new Promise( async (resolve, reject) => {
      this.headers = page_size ? this.headers.set('page_size', page_size) : this.headers;
      this.headers = page_number ? this.headers.set('page_number', page_number) : this.headers;
      this.headers = order_by ? this.headers.set('order_by', order_by) : this.headers;
      this.headers = sort_by ? this.headers.set('sort_by', sort_by) : this.headers;
      this.headers = search ? this.headers.set('search', search) : this.headers;
      this.headers = await this.headers.set('authorization', localStorage.getItem('token'));
      this.httpClt.get(this.apiUrl + url, {headers: this.headers}).subscribe(
        res => { resolve(res) },
        err => { reject(err) }
      );
    });
  }

  getMasterData(url) {
    new Promise((res, rej) => {

    });
  }

  postData(url, data) {
    new Promise((res, rej) => {

    });
  }
}
