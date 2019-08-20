import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.page.html',
  styleUrls: ['./article-view.page.scss'],
})
export class ArticleViewPage implements OnInit {

  id;
  dataArticle: any;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ionViewDidEnter() {
    this.getIdArticle();
    this.getArticleData();
  }

  getIdArticle(){
    return this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    });
  }

  getArticleData() {
    const data = {id: this.id};
    return this.api.postData('article/detail', data).then((result) => {
      console.log(result);
      this.dataArticle = JSON.parse(JSON.stringify(result)).data;
      console.log(this.dataArticle);
    });
  }
  
  ngOnInit() {
  }

}
