import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as md5 from "md5";
import { Md5 } from "ts-md5/dist/md5";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'https://jcocmusic.herokuapp.com/api/'
  headers = new HttpHeaders();

  constructor(
    private httpClt: HttpClient,
    private md5: Md5
  ) { 
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

  login(user, pass) {
    // new Promise((res, rej) => {
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
    // });
  }

  getListData(url, params) {
    new Promise((result, reject) => {

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
