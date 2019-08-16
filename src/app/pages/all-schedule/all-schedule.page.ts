import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.page.html',
  styleUrls: ['./all-schedule.page.scss'],
})
export class AllSchedulePage implements OnInit {

  page_size = '100';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listSchedule:any;

  constructor(
    private api : ApiService,
    public navCtrl: NavController
  ) { }

  ionViewDidEnter(){
    this.getDataSchedule();
    console.log('all Schedule');
  }

  getDataSchedule(){
    console.log('schedule');
    this.api.getListData('schedule', this.page_size, this.page_number, this.order_by, this.sort_by, this.search).then((result) =>{
      console.log(result);
      this.listSchedule = JSON.parse(JSON.stringify(result)).data;
      console.log(this.listSchedule);
    });
  }

  sendIdSchedule(id){
    console.log(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward([''], navigationExtras);
  }

  async searchData() {

  }

  ngOnInit() {
  }

}
