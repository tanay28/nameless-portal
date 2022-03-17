import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';
import { FirebaseService } from '../../__services/firebase.service';
import { NgxSpinnerService } from "ngx-spinner";
import { staticdata } from '../../constants/staticdata';

@Component({
  selector: 'app-our-works',
  templateUrl: './our-works.component.html',
  styleUrls: ['./our-works.component.css']
})
export class OurWorksComponent implements OnInit {
  ourWorkData: any;
  aboutUsImgData: any;
  contentData: any;

  shortFilms: any[] = [];
  musicVideos: any[] = [];
  audioStory: any[] = [];
  trailers: any[] = [];
  upcomings: any[] = [];

  constructor(
    private storage: AngularFireStorage,
    private spinner : NgxSpinnerService,
    private fbService: FirebaseService
  ) { }

  async ngOnInit() {

    this.resetContents();
    this.ourWorkData = staticdata.ourwork.textData;
    this.shortFilms = staticdata.ourwork.contents.shortFilms;
    this.musicVideos = staticdata.ourwork.contents.musicVideos;
    this.audioStory = staticdata.ourwork.contents.audioStory;
    this.trailers = staticdata.ourwork.contents.trailer;
    this.upcomings = staticdata.ourwork.contents.upcoming;

    try {
      await this.getOurWorkText();
    } catch(err) {
      this.ourWorkData = '';
      this.ourWorkData = staticdata.ourwork.textData;
    }
    try {
      await this.getAllContent();
    } catch(err) {
      this.resetContents();
      this.shortFilms = staticdata.ourwork.contents.shortFilms;
      this.musicVideos = staticdata.ourwork.contents.musicVideos;
      this.audioStory = staticdata.ourwork.contents.audioStory;
      this.trailers = staticdata.ourwork.contents.trailer;
      this.upcomings = staticdata.ourwork.contents.upcoming;
    }
  
  }

  getOurWorkText() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllOurWorkData().subscribe(res => {
        if(res.length > 0) {
          this.ourWorkData = '';
          this.ourWorkData = res[0].description != '' ? res[0].description : staticdata.ourwork.textData;
        } else {
          this.ourWorkData = staticdata.ourwork.textData;
        }
        resolve('ok');
      }, err => {
        this.ourWorkData = '';
        this.ourWorkData = staticdata.ourwork.textData;
        reject('no data');
      });
    });
  }
  resetContents() {
    this.shortFilms = [];
    this.musicVideos = [];
    this.audioStory = [];
    this.trailers = [];
    this.upcomings = [];
  }

  filerContents(type: any, data: any) {
    let filteredData: any[] = [];
    data.forEach((element:any) => {
      if(element.contentType == type) {
        filteredData.push(element);
      }
    });
    return filteredData;
  }

  getAllContent() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllContentData().subscribe(res => {
        if(res.length > 0) {
          this.resetContents();
          this.shortFilms = this.filerContents('short_film',res).length > 0 ? this.filerContents('short_film',res) : staticdata.ourwork.contents.shortFilms;
          this.musicVideos = this.filerContents('music_video',res).length > 0 ? this.filerContents('music_video',res) : staticdata.ourwork.contents.musicVideos;
          this.audioStory = this.filerContents('audio_story',res).length > 0 ? this.filerContents('audio_story',res) : staticdata.ourwork.contents.audioStory;
          this.trailers = this.filerContents('trailer',res).length > 0 ? this.filerContents('trailer',res) : staticdata.ourwork.contents.trailer;
          this.upcomings = this.filerContents('upcoming',res).length > 0 ? this.filerContents('upcoming',res) : staticdata.ourwork.contents.upcoming;
        }
        resolve('ok');
      }, err => {
        this.resetContents();
        this.shortFilms = staticdata.ourwork.contents.shortFilms;
        this.musicVideos = staticdata.ourwork.contents.musicVideos;
        this.audioStory = staticdata.ourwork.contents.audioStory;
        this.trailers = staticdata.ourwork.contents.trailer;
        this.upcomings = staticdata.ourwork.contents.upcoming;
        reject('no content received');
      });
    });
  }

}
