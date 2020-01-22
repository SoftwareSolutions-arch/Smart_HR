import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $:any;


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  public rows = [];

  public srch = [];
  Emp:any;
  Full:any;
  public addD:any = {};
  addDepartmentValidation:boolean = false;
  
  constructor(private appService:AppService,private router:Router,private route:ActivatedRoute,private httpservice: HttpClient) { 
    this.rows = appService.departments;
    this.srch = [...this.rows];
    
  }

  ngOnInit() {
    this.getFullname()
  }

  getFullname() {
    this.httpservice.get('http://localhost:3000/api/postdepartment').subscribe(user => {
      this.Emp = user;
       console.log("Angularjs",this.Emp);
        let dataStore = []
        console.log("welcome sir how may i help you!!!!",dataStore)
        console.log("Name ",user['data'][0]['department'])
        var i;
        for (i = 0; i < user['data'].length; ++i) {
          dataStore.push({
            'department':user['data'][i]['department'],
            '_id': this.Emp['data'][i]['_id'],
        
        })
        }
        this.Full = dataStore;  
        console.log(this.Full ,"dataStore value")
    })
  }
  
  addReset(){
    this.addD = {'department': ''};
    $('#add_department').modal('show');
  }

  addDepartment(f){
    //console.log(f);
    let randomnumber = Math.floor(Math.random() * 99);
    f.form.value.department_id = randomnumber;
    if (f.invalid === true)
    this.addDepartmentValidation = true;
    else {
    this.addDepartmentValidation = false;
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#add_department').modal('hide');
    }

    var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/postdepartment",
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
    //console.log(item);
    this.router.navigate(['employees/departments/edit'], { queryParams: { 'id': item.department_id } });
  }

  onDelete(item) {
    if (confirm("Are you sure to delete this user name" )) {
      const payload = {
        _id: item._id
      }
      console.log("delete id availble here",payload)
      this.httpservice.post('http://localhost:3000/api/deletedepartment',payload).subscribe(res => { 
      console.log(res, 'delete result');
      window.location.reload();
      })
    }
  }
}
