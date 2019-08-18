import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.page.html',
  styleUrls: ['./view-schedule.page.scss'],
})
export class ViewSchedulePage implements OnInit {

  id;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  getIdSchedule(){
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
    console.log(this.id);
  }

  ngOnInit() {
  }

}
