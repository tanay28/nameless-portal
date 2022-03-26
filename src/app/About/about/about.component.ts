import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';
import { FirebaseService } from '../../__services/firebase.service';
import { NgxSpinnerService } from "ngx-spinner";
import { staticdata } from '../../constants/staticdata';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  aboutUsData: any;
  aboutUsImgData: any[] = [];
  achievementsData: any[] = [];
  basePath = '/achievements';
  imageList: any = [];
  isGalleryData: boolean = false;
  constructor(
    private storage: AngularFireStorage,
    private spinner : NgxSpinnerService,
    private fbService: FirebaseService
  ) { }

  async ngOnInit() {
    this.resetData();
    this.isGalleryData = false;
    this.aboutUsData = staticdata.aboutus.textData;
    //this.aboutUsImgData = staticdata.aboutus.imgData;
    //this.achievementsData = staticdata.aboutus.achievementsData;

    try {
      await this.getTextData();
    } catch(err: any) {
      this.aboutUsData = staticdata.aboutus.textData;
    }

    try {
      await this.getImgData();
    } catch(err) {
      this.resetData();
      // this.aboutUsImgData = staticdata.aboutus.imgData;
      // this.achievementsData = staticdata.aboutus.achievementsData;
    }
  }

  resetData() {
    this.aboutUsImgData = [];
    this.achievementsData = [];
  }

  getTextData() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllAboutUsData().subscribe(res => {
        if(res.length > 0) {
          this.aboutUsData = res[0].description != '' ? res[0].description : staticdata.aboutus.textData;
        } else {
          this.aboutUsData = staticdata.aboutus.textData;
        }
        resolve('ok');
      }, err => {
        this.aboutUsData = staticdata.aboutus.textData;
        reject('no data received.!!!');
      });
    });
  }

  filterImges(type : any, data : any) {
    let dataUrl: any[] = [];
    data.forEach((element: any) => {
      if(element.imgType == type) {
        dataUrl.push(element.imgUrl)
      }
    });
    return dataUrl;
  }
  getImgData() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllAchievementData().subscribe(res => {
        if(res.length > 0) {
          this.resetData();
          this.isGalleryData = true;
          this.achievementsData = this.filterImges('achievement',res).length > 0 ? this.filterImges('achievement',res) : [];
          this.aboutUsImgData = this.filterImges('ourgenere',res).length > 0 ? this.filterImges('ourgenere',res) : [];
        }
        resolve('ok');
      }, err => {
        this.resetData();
        this.aboutUsImgData = [];
        this.achievementsData = [];
        reject(err);
      });
    });
  }

}
