import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.page.html',
  styleUrls: ['./add-schedule.page.scss'],
})
export class AddSchedulePage implements OnInit {

  listGender = [
    {
      id: 1,
      name: "Satu"
    },
    {
      id: 2,
      name: "Dua"
    },
    {
      id: 3,
      name: "Tiga"
    }
  ]

  hasilGender = [];

  dataSchedule = {
    event_date: "",
    event_name: "",
    basis: 0,
    gitaris: 0,
    drummer: 0,
    user_id: 0,
    pianis: 0,
    vokalis: [],
    song_leader: [],
    lagu: [],
    image: {
      file_name: "",
      file_size: 0,
      file_type: "",
      base64: ""
    }
  };



  constructor() { }

  ngOnInit() {
  }

  check(){
    let x = [];
    this.hasilGender.forEach((val, i) => {
      return x.push(val.id);
    });
    console.log(x);
  }

}
