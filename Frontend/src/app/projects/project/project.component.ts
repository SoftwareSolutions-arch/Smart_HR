import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { AppService } from 'src/app/app.service';

declare const $:any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };

  public rows = [];
  public srch = [];
  public allProjects:boolean = true;
  public deadline:boolean = false;
  public addP:any = [];
  public uptP:any = [];
  public viewP:any = [];
  Emp:any;
  Full:any;
  
  constructor(private projectService:AppService,private httpservice: HttpClient) { 
    this.rows = projectService.projects;
    this.srch = [...this.rows];
  }

  ngOnInit() {
    this.getFullname();

    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    for(var i=0;i<this.rows.length;i++)
    {
      this.rows[i].description = this.rows[i].description.split(/\s+/).slice(0,25).join(" ");
    }

    this.addP = {
      'projectName':'',
      'projectID':'',
      'role':'',
      'leader': '',
      'deadline': '',
      'description': '',
      'cost':'',
      'rate':'',
      'totalHours':'',
      'createdOn': '',
      'createdBy': '',
      'status': '',
      'priority':'',
      'progress':0,
      'client':'',
      'startDate':'',
      'endDate':''
    };

    this.uptP = {
      'projectName':'',
      'projectID':'',
      'role':'',
      'leader': '',
      'deadline': '',
      'description': '',
      'cost':'',
      'rate':'',
      'totalHours':'',
      'createdOn': '',
      'createdBy': '',
      'status': '',
      'priority':'',
      'progress':0,
      'client':'',
      'startDate':'',
      'endDate':''
    };

    this.uptP = {
      'projectName':'',
      'description': ''
    };

  }

  addProject(f)
  {
    //console.log(f.form.value);
    f.form.value.deadline = {formatted: "17-01-2018"};
    f.form.value.description = f.form.value.description.split(/\s+/).slice(0,25).join(" ");
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#create_project').modal('hide');

     var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/postprojectRouter",
      type: 'POST',
      data: myJSON,
      contentType: "application/json",
      dataType: 'json',
      success: function (response) {
        console.log(response);
        // this.router.navigate(['employees/all-employees']);
      },
      error: function (response) {
        console.log(response);
      }
    });
  }

  updateProject(f)
  {
    //console.log(f.form.value);
    f.form.value.description = f.form.value.description.split(/\s+/).slice(0,25).join(" ");
    var id = f.form.value.projectID;
    //console.log(id);
    var arr = this.rows.find(function(item, i){
      return item.projectID === id
    });

    arr.client = f.form.value.client;
    arr.cost = f.form.value.cost;
    arr.leader = f.form.value.leader;
    arr.description = f.form.value.description;
    arr.rate = f.form.value.rate;
    arr.projectName = f.form.value.projectName;
    arr.startDate = f.form.value.startDate;
    arr.endDate = f.form.value.endDate;
    arr.priority = f.form.value.priority;

    var index = this.rows.findIndex(function(item, i){
      return item.projectID === id
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
    }
    this.rows = this.rows;

    this.rows.unshift(arr);
    this.srch.unshift(arr);
    this.rows = this.rows;
    $('#edit_project').modal('hide');
    
  }

  // getFullname() {
  //   console.log("inside getFullName");
  //   this.httpservice.get('http://localhost:3000/api/postprojectRouter').subscribe(user => {
  //     this.Emp = user;
  //     console.log("Angularjs", this.Emp);
  //   })
  // }


  
  getFullname() {
    console.log("inside getFullName");
    this.httpservice.get('http://localhost:3000/api/postprojectRouter').subscribe(user => {
      this.Emp = user;
      console.log("Angularjs", this.Emp);
      let dataStore = []
      console.log("welcome sir how may i help you!!!!", dataStore);
      console.log("Name ", this.Emp['data'][0]['firstName']);
      var i;
      for (i = 0; i < this.Emp['data'].length; i++) {
        let xyzabcd = []
        var j
        for (j = 0; j < this.Emp['data'][i]['deadline'].length; j++) {
          xyzabcd.push({ 
            // 'module': this.Emp['data'][i]['employee_modules'][j]['module'],
              'date': this.Emp['data'][i]['deadline'][j]['formatted'] 
        })
        }
        dataStore.push({
          '_id': this.Emp['data'][i]['_id'],
          'Client': this.Emp['data'][i]['Client'],
          'cost': this.Emp['data'][i]['cost'],
          'description': user['data'][i]['description'],
          'leader': user['data'][i]['leader'],
          'priority': user['data'][i]['priority'],
          'projectName': user['data'][i]['projectName'],
          'rate': user['data'][i]['rate'],
          'date': xyzabcd
          
        })
      }
      this.Full = dataStore;
      console.log(this.Full, "dataStore value");
    })
  }

  onEdit(item){
    let temp;
    //console.log(item);
    temp = item;
    this.uptP = temp;
  }

  editView(id){
    let temp;
    //console.log(id);
    temp = this.rows.find(function(item, i){
      return item.projectID === id
    });
    this.uptP = temp;
    $('#view_project').modal('hide');
    $('#edit_project').modal('show');
  }

  onDelete(c){
    //console.log("="+c.projectID+"=");
    var index = this.rows.findIndex(function(item, i){
      return item.projectID === c.projectID
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
        this.srch.splice(index, 1);
    }        
    //console.log(this.rows);
    this.rows = this.rows;
  }

  searchPName(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.projectName);
      val = val.toLowerCase();
      return d.projectName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchEName(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.client);
      val = val.toLowerCase();
      return d.client.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchRole(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.role);
      val = val.toLowerCase();
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  viewProfile(item)
  {
    this.deadline = true;
    let temp;
    //console.log(item);
    temp = item;
    this.viewP = temp;
  }

  
}
