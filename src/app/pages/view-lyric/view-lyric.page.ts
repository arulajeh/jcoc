import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-view-lyric',
  templateUrl: './view-lyric.page.html',
  styleUrls: ['./view-lyric.page.scss'],
})
export class ViewLyricPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
