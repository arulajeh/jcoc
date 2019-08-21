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
      page_number ? this.headers = this.headers.set('page_number', page_number) : '';
      page_size ? this.headers = this.headers.set('page_size', page_size) : '';
      order_by ? this.headers = this.headers.set('order_by', order_by) : '';
      sort_by ? this.headers = this.headers.set('sort_by', sort_by) : '';
      search ? this.headers = this.headers.set('search', search) : '';
      this.headers = await this.headers.set('authorization', localStorage.getItem('token'));
      this.httpClt.get(this.apiUrl + url, {headers: this.headers}).subscribe(
        res => { resolve(res) },
        err => { reject(err) }
      );
    });
  }

  getMasterData(url) {
    return new Promise((resolve, reject) => {
      this.headers = this.headers.set('authorization', localStorage.getItem('token') ? localStorage.getItem('token') : '');
      this.httpClt.get(this.apiUrl + url, {headers: this.headers}).subscribe(
        res => { resolve(res) },
        err => { reject(err) }
      );
    });
  }

  postData(url, data) {
    return new Promise((resolve, reject) => {
      this.headers = this.headers.set('authorization', localStorage.getItem('token') ? localStorage.getItem('token') : '');
      this.httpClt.post(this.apiUrl + url, data, {headers: this.headers}).subscribe(
        res => { resolve(res) },
        err => { reject(err) }
      );
    });
  }

  parseEmbedUrl(data){
    let a = data;
    let b = '';
    if (a.includes('youtube.com')) {
      b = a.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if(a.includes('youtu.be/')) {
      b = a.replace('youtu.be/', 'youtube.com/embed/')
    } else if(a.includes('youtube.com/embed/')) {
      b = a;
    }
    return b;
  }

  isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };
}
