import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-allmusic',
  templateUrl: './allmusic.page.html',
  styleUrls: ['./allmusic.page.scss'],
})
export class AllmusicPage implements OnInit {

  //trustedVideoUrl: SafeResourceUrl;
  trustedVideoUrl: SafeResourceUrl;

  page_size = '5';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  safeUrl = [];
  listMusics = [];
  resp:any;

  constructor(
    public navCtrl: NavController,
    private domSanitizer: DomSanitizer,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

  ngOnInit() {
  }

  testUrl(url) {
    // var a = "url";
    // var b = "";
    // if (a.startsWith("https://") || a.startsWith("http://")) {
    //   a.replace("https://" || "http://", "https://");
    //   if (a.startsWith("www.youtube.com/watch?v=")) {
        
    //   } else {
        
    //   }
    // } else {
    //   if (a.startsWith("www.youtube.com/watch?v=")) {
    //     b = a.replace("www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //     // console.log(b);
    //   } else if (a.startsWith("youtube.com/watch?v=")) {
    //     b = a.replace("youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //   } else if(a.startsWith("youtu.be/")) {
    //     b = a.replace("youtu.be/", "https://www.youtube.com/embed/");
    //   }
    // }
    // if (a.startsWith("https://") || a.startsWith("http://")) {
    //   a.replace("https://" || "http://", "https://")
    //   if (a.startsWith("www.youtube.com/watch?v=")) {
    //     b = a.replace("www.youtube.com/watch?v=", "www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("http://www.youtube.com/watch?v=")) {
    //     b = a.replace("http://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("https://youtu.be/")) {
    //     b = a.replace("https://youtu.be/", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("http://youtu.be/")) {
    //     b = a.replace("http://youtu.be/", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("http://youtube.com/watch?v=")) {
    //     b = a.replace("http://youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("https://youtube.com/watch?v=")) {
    //     b = a.replace("https://youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else {
    //     console.log('no i dont');
    //   }  
    // } else {
    //   if (a.startsWith("www.youtube.com/watch?v=")) {
    //     b = a.replace("www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //     console.log(b);
    //   } else if (a.startsWith("youtube.com/watch?v=")) {
    //     b = a.replace("youtube.com/watch?v=", "https://www.youtube.com/embed/");
    //   } else if(a.startsWith("youtu.be/")) {
    //     b = a.replace("youtu.be/", "https://www.youtube.com/embed/");
    //   }
    // }
  }
  
  async ionViewDidEnter() {
    // this.testUrl();
    await this.getDataMusic();
  }

  convertSafeUrl(data){
    this.safeUrl = [];
    for (let index of data) {
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(index.link);
      this.safeUrl.push({
        url:this.trustedVideoUrl,
        title: index.judul,
        artist: index.penyanyi,
        id: index.id
      });
    }
  }

  getDataMusic() {
    this.safeUrl = [];
    return this.showLoading().then(() => {
      return this.api.getListData('music/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result)).data
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(result));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getDataMusic();
        } else {
          this.listMusics = data;
          return this.convertSafeUrl(this.listMusics);
        }
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting data');
      });
    })
  }

  sendIdMusic(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/view-lyric'], navigationExtras);
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getDataMusic();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getDataMusic();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getDataMusic();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getDataMusic();
    }
  }

  async showLoading() {
    const a = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      message: "Getting data..",
      spinner: "dots"
    });

    a.present();
  }

  doRefresh(event) {
    this.getDataMusic()
    .then(() => {
      event.target.complete();
    });
  }

  async showToast(msg) {
    const a = await this.toastCtrl.create({
      animated: true,
      message: msg,
      position: "bottom",
      duration: 2000
    });

    a.present();
  }

}
