import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.page.html',
  styleUrls: ['./all-user.page.scss'],
})
export class AllUserPage implements OnInit {
  page_size = 100;
  page_number = 1;
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listMembers: any;

  constructor(
    private navCtrl: NavController,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getMemberList();
    console.log('all member list')
  }

  initData() {

  }

  getMemberList() {
    console.log('member')
    this.api.getListData('users', this.page_size, this.page_number, this.order_by, this.sort_by, this.search)
    .then((res) => {
      console.log(res);
      // this.listMembers = JSON.parse(JSON.stringify(res)).data;
      // console.log(this.listMembers);
    })
  }

}
