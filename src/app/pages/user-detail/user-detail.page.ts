import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  id:number;
  resp: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getParams();
  }

  ionViewDidEnter() {
    this.getUserDetail();
  }

  getParams(){
    this.route.queryParams.subscribe((params) => {
      this.id = JSON.parse(params['id']);
      console.log(this.id);
    })
  }

  getUserDetail() {
    const body = {id: this.id};
    this.api.postData('users/detail', body).then((result) => {
      this.resp = JSON.parse(JSON.stringify(result)).data;
      console.log(this.resp);
    })
  }

}
