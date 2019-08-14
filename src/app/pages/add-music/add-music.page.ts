import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-music',
  templateUrl: './add-music.page.html',
  styleUrls: ['./add-music.page.scss'],
})
export class AddMusicPage implements OnInit {

  dataMusic = {
    judul: '',
    penyanyi: '',
    lirik: '',
    chord: '',
    link: ''
  }

  page_size = null;
  page_number = null;
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  ionSelect = null;

  listMusic = [];

  constructor(
    private api: ApiService
  ) { }

  async ionViewDidEnter(){
    await this.initData();
  }

  async submit(){
    this.api.postData('music/create', this.dataMusic).then((result) => {
      console.log(result);
    })
    console.log(this.dataMusic);
  }

  initData(){
    this.getMusicList();
  }

  getMusicList(){
    console.log('music list');
    return this.api.getListData('music', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ').then((result) => {
      console.log(result);
      return this.listMusic = JSON.parse(JSON.stringify(result)).data;
    }).catch(err => {alert('Error Get Data')});
  }

  async searchData(){
    console.log('value search',this.search);
    await this.getMusicList().then((res) => {
      this.listMusic = [];
      console.log('list music baru', res);
    })
  }

  changeSelect(){
    console.log(this.ionSelect);
  }

  ngOnInit() {
  }

}
