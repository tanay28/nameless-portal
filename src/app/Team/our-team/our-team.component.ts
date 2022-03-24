import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';
import { FirebaseService } from '../../__services/firebase.service';
import { NgxSpinnerService } from "ngx-spinner";
import { staticdata } from '../../constants/staticdata';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.css']
})
export class OurTeamComponent implements OnInit {

  founders: any[] = [];
  others: any[] = [];
  technicals: any[] = [];
  type = {
    developer : 'WEB DEVELOPER',
    founder : 'FOUNDER'
  }
  constructor(
    private storage: AngularFireStorage,
    private spinner : NgxSpinnerService,
    private fbService: FirebaseService
  ) { }

  async ngOnInit() {

    this.resetData();
    this.getStatiData();

    try {
      await this.getAllTeamData();
      // console.log('founders',this.founders);
      // console.log('others',this.others);
      // console.log('technicals',this.technicals);
    } catch(err) {
      this.resetData();
      this.getStatiData();
    }
  }

  getStatiData() {
    this.founders = staticdata.teams.founders;
    this.others = staticdata.teams.others;
    this.technicals = staticdata.teams.technicals;
  }

  resetData() {
    this.founders = [];
    this.others = [];
    this.technicals = [];
  }

  filerTeams(type: any, data: any) {
    let teamdata: any[] = [];
    data.forEach((element: any) => {
      if(type != 'others') {
        let roles = element.role.split(','); 
        if(roles.includes(type)) {
          let modifiedRoles = '';
          modifiedRoles = element.role.split(',').filter((element: any) => {
             return element != 'WEB DEVELOPER';
          });

          let obj = {
            imgUrl : element.imgUrl,
            fullName : element.fullName,
            role : modifiedRoles.toString(),
            links : {
              fb : '',
              linkedIn: ''
            }
          };

          teamdata.push(obj);
        }
      } else {
        let modifiedRoles = '';
        modifiedRoles = element.role.split(',').filter((element: any) => {
          return (element != 'WEB DEVELOPER' && element != 'FOUNDER');
       });
       let roles = element.role.split(',');
       if(!roles.includes(this.type.founder)) {
        const obj = {
          imgUrl : element.imgUrl,
          fullName : element.fullName,
          role :  modifiedRoles.toString()
        };
        teamdata.push(obj);
       } else {
        if(roles.includes(this.type.developer)) {
          const obj = {
            imgUrl : element.imgUrl,
            fullName : element.fullName,
            role :  modifiedRoles.toString()
          };
          teamdata.push(obj);
        }
       }
      }
     
    });
    return teamdata;
  }

  getAllTeamData() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllTeamData().subscribe(res => {
        if(res.length > 0) {
          this.founders = this.filerTeams(this.type.founder,res).length > 0 ? this.filerTeams(this.type.founder,res) : staticdata.teams.founders;
          this.technicals = this.filerTeams(this.type.developer,res).length > 0 ? this.filerTeams(this.type.developer,res) : staticdata.teams.technicals;
          this.others = this.filerTeams('others',res).length > 0 ? this.filerTeams('others',res) : staticdata.teams.others;
        } else {
          this.resetData();
          this.getStatiData();  
        }
        resolve('ok');
      }, err => {
        this.resetData();
        this.getStatiData();
        reject('no data');
      });
    })
  }

}
