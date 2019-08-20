import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.page.html',
  styleUrls: ['./view-schedule.page.scss'],
})
export class ViewSchedulePage implements OnInit {

  resp;
  id;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ionViewDidEnter() {
    this.getIdSchedule();
    this.getScheduleData();
  }

  getIdSchedule(){
    return this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    });
  }

  getScheduleData() {
    const data = {id: this.id};
    return this.api.postData('schedule/detail', data).then((result) => {
      console.log(result);
      this.resp = JSON.parse(JSON.stringify(result)).data;
      console.log(this.resp);
    });
  }

  ngOnInit() {
  }

}
