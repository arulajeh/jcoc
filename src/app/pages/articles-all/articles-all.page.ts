import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-articles-all',
  templateUrl: './articles-all.page.html',
  styleUrls: ['./articles-all.page.scss'],
})
export class ArticlesAllPage implements OnInit {

  page_size = '100';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listArticle:any;

  constructor(
    private api: ApiService,
    public navCtrl: NavController
  ) { }

  ionViewDidEnter(){
    this.getDataArticle();
    console.log('all Article');
  }

  getDataArticle(){
    console.log('Article');
    this.api.getListData('article/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search).then((result) =>{
      console.log(result);
      this.listArticle = JSON.parse(JSON.stringify(result)).data;
      console.log(this.listArticle);
    });
  }

  sendIdArticle(id){
    console.log(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/article-view'], navigationExtras);
  }

  ngOnInit() {
  }

}
