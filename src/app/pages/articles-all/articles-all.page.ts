import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-articles-all',
  templateUrl: './articles-all.page.html',
  styleUrls: ['./articles-all.page.scss'],
})
export class ArticlesAllPage implements OnInit {
  imgNotFound = 'assets/img/image.png';
  resp:any;

  page_size = '100';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listArticle:any;

  constructor(
    private api: ApiService,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { }

  ionViewDidEnter(){
    this.getDataArticle();
  }

  getDataArticle(){
    this.showLoading('Getting articles').then(() => {
      this.api.getListData('article/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search)
      .then((result) =>{
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(result));
        this.listArticle = this.resp.data;
      }).then(() => {
        this.getImages();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
      })
    })
  }

  sendIdArticle(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/article-view'], navigationExtras);
  }

  ngOnInit() {
  }

  getImages() {
    Promise.all(
      this.listArticle.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.listArticle.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

  async showLoading(msg) {
    const x = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      message: msg,
      showBackdrop: true,
      spinner: "dots",
      keyboardClose: true
    });
    x.present();
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getDataArticle();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getDataArticle();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getDataArticle();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getDataArticle();
    }
  }

}
