import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $:any;

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  rows = [];

  public srch = [...this.rows];
  Emp:any;
  Full:any;
  Dull:any;
  public addD:any = {};
  addDesignationValidation:boolean = false;
  
  constructor(private appService:AppService,private router:Router,private route:ActivatedRoute,private httpservice: HttpClient) { 
    this.rows = appService.designations;
    this.srch = [...this.rows];
    
  }

  ngOnInit() {

    this.getFullname()
    this.getNamedata()
  }

  getFullname() {
    this.httpservice.get('http://localhost:3000/api/postdesignation').subscribe(user => {
      this.Emp = user;
        let dataStore = []
        var i;
        for (i = 0; i < user['data'].length; ++i) {
          dataStore.push({
            'designation':user['data'][i]['designation'],
            'department': this.Emp['data'][i]['department'],
            '_id': this.Emp['data'][i]['_id'],
        
        })
        }
        this.Full = dataStore;  
        console.log(this.Full ,"dataStore value")
    })
  }

  getNamedata() {
    console.log("Hello from getNamedata");
    this.httpservice.get('http://localhost:3000/api/postdepartment').subscribe(user => {
      this.Emp = user;
      console.log("finally i am inside ",this.Emp);
        let dataStore = []
        var i;
        for (i = 0; i < user['data'].length; ++i) {
          dataStore.push({
            'department': this.Emp['data'][i]['department'],
        })
        }
        this.Dull = dataStore;  
        console.log(this.Full ,"dataStore value")
    })
  }

  addReset(){
    this.addD = {'designation':'','department': 'Web Development'};
    $('#add_designation').modal('show');
  }

  addDesignation(f){
    //console.log(f);
    let randomnumber = Math.floor(Math.random() * 99);
    f.form.value.designation_id = randomnumber;
    if (f.invalid === true)
    this.addDesignationValidation = true;
    else {
      this.addDesignationValidation = false;
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#add_designation').modal('hide');
    }

    var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/postdesignation",
      type: 'POST',
      data: myJSON,
      contentType: "application/json",
      dataType: 'json',
      success: function (response) {
        console.log(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  }   

  onEdit(item){
    this.router.navigate(['employees/designations/edit'], { queryParams: { 'id': item.designation_id } });
  }

  onDelete(item) {
    if (confirm("Are you sure to delete this user name" )) {
      const payload = {
        _id: item._id
      }
      console.log("delete id availble here",payload)
      this.httpservice.post('http://localhost:3000/api/deletedesignation',payload).subscribe(res => { 
      console.log(res, 'delete result');
      window.location.reload();
      })
    }
  }
}
