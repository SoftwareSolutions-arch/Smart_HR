import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $: any;

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent implements OnInit {
  productDataform: FormGroup;
  _id: any;
  http: any;
  errorMsg: string;
  name: any;
  pwd: any;

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };

  rows = [];
  public updateEmp = [];
  public createEmp: any = {};
  public srch = [];
  addEmployeeValidation: boolean = false;
  // modify:boolean = false;
  // uptEmployeeValidation: boolean = false;

  public columns: Array<any> = [
    { title: 'Name', name: 'name', sort: true },
    { title: 'Employee ID', name: 'employeeID', sort: true },
    { title: 'Email', name: 'email', sort: true },
    { title: 'Mobile', name: 'mobile', sort: true },
    { title: 'Join Date', name: 'joinDate', sort: true },
    { title: 'Role', name: 'role', sort: true },
    { title: 'Action', name: 'action', sort: true }
  ];

  public allEmployees: boolean = true;

  public data = [];

  // public addEmp: any = {};
  addEmp = {
    firstName: '',
    lastName: '',
    employeeID: 0,
    email: '',
    phone: '',
    company: '',
    designation: '',
    userName: '',
    password: '',
    cPassword: '',
    joinDate: '',
    // joinDate: { formatted: "" }
  }

  // public date: Date = new Date();
  // public model: any = { date: { year: this.date.getFullYear(), month: this.date.getMonth() + 1, day: this.date.getDate() } };
  Full: any;
  Emp: Object;
  xyz: any;

  constructor(private appService: AppService, private router: Router, private httpservice: HttpClient) {
    
    this.rows = appService.getdata();
    this.srch = [this.rows];
  }

  ngOnInit() {
    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

     this.getFullname();
    //  this.getFullNames()
    // this.getarraydataa();ks

  }
  public empUpt = {};
  public vals = [];
  dataStore: any;

  getFullname() {
    console.log("inside getFullName");
    this.httpservice.get('http://localhost:3000/api/createlogin').subscribe(user => {
      this.Emp = user;
      console.log("Angularjs", this.Emp);
      let dataStore = []
      console.log("welcome sir how may i help you!!!!", dataStore);
      console.log("Name ", this.Emp['data'][0]['firstName']);
      var i;
      for (i = 0; i < this.Emp['data'].length; i++) {
        let xyzabcd = []
        var j
        for (j = 0; j < this.Emp['data'][i]['joinDate'].length; j++) {
          xyzabcd.push({ 
            // 'module': this.Emp['data'][i]['employee_modules'][j]['module'],
              'date': this.Emp['data'][i]['joinDate'][j]['formatted'] 
        })
        }
        dataStore.push({
          '_id': this.Emp['data'][i]['_id'],
          'firstName': this.Emp['data'][i]['firstName'],
          'lastName': this.Emp['data'][i]['lastName'],
          'employeeID': user['data'][i]['employeeID'],
          'email': user['data'][i]['email'],
          'phone': user['data'][i]['phone'],
          'userName': user['data'][i]['userName'],
          'company': user['data'][i]['company'],
          'designation': user['data'][i]['designation'],
          'password': user['data'][i]['password'],
          'cPassword': user['data'][i]['cPassword'],
          'date': xyzabcd
          // 'joinDate': user['data'][i]['joinDate'],
          // 'holidays': user['data'][i]['holidays'],
          // 'leave_requests': user['data'][i]['leave_requests'],
          // 'clients': user['data'][i]['clients'],
          // 'projects': user['data'][i]['projects'],
          // 'tasks': user['data'][i]['tasks'],
          // 'chats': user['data'][i]['chats'],
          // 'assets': user['data'][i]['assets'],
          // 'timing_sheets': user['data'][i]['holidays'],
          
        })
      }
      this.Full = dataStore;
      console.log(this.Full, "dataStore value");
    })
  }

//   getarraydataa(){
//     this.httpservice.get('http://localhost:3000/api/createlogin').subscribe(user => {
//       this.Emp=user;
//       this.Emp['data']['firstName'].forEach((item, index, array) => {
//         console.log('computer1',item);
//         this.xyz=item;
//         // this.xyz
//         console.log('computer2',index);
//         console.log('computer3',array);
        
//       });
//   })
// }


//#####################################################################################################
// user;users;xyz;
//   getFullNames(){
//     this.httpservice.get('http://localhost:3000/api/createlogin').subscribe(user => {
//       this.xyz=user;
//      this.xyz.forEach(element => {
//        this.users=element;
//        console.log("get full names",this.users)
//      });
        
//       });
// }
//#####################################################################################################
  addReset() {
    let randomnumber = Math.floor(Math.random() * 99);
    //this.createEmp = {'employeeID':randomnumber};
    //console.log(randomnumber)
    this.addEmp = {
      firstName: '',
      lastName: '',
      employeeID: randomnumber,
      email: '',
      phone: '',
      company: '',
      designation: '',
      userName: '',
      password: '',
      cPassword: '',
      joinDate: '',
      // joinDate: { formatted: "" }
    }

    $('#add_employee').modal('show');
  }

  addSubmit(f) {
    if (f.invalid === true)
      this.addEmployeeValidation = true;
    else {
      this.addEmployeeValidation = false;
      // this.rows.unshift(f.form.value);
      // this.srch.unshift(f.form.value);
      // this.rows = this.rows;
      $('#add_employee').modal('hide');
    }

    var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/createlogin",
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

  onEdit(policy) {
    console.log(policy,"id of policy bottle")
    // this.modify=true
    this.appService.setdata(policy); 
    localStorage.setItem('employee_id', policy._id)
     this.router.navigate(['employees/all-employees/edit']);
  }

  // updateSubmit(f) {
  //   this.modify=true
  //   //console.log(f.form.value);
  //   if (f.invalid === true)
  //     this.uptEmployeeValidation = true;
  //   else {
  //     this.uptEmployeeValidation = false;
  //     // var id = f.form.value.employeeID;
  //    var id = localStorage.getItem('employee_id')
  //    console.log(id, 'empid')
  //     //console.log(id);
  //     var index = this.rows.findIndex(function (item, i) {
  //       return item.employeeID === id
  //     });

  //     //console.log(index);
  //     if (index > -1) {
  //       this.rows.splice(index, 1);
  //     }

  //     this.rows.unshift(f.form.value);
  //     this.srch.unshift(f.form.value);
  //     this.rows = this.rows;
  //     this.router.navigate(['employees/all-employees']);
  //   }
  // }

  onDelete(policy) {
    if (confirm("Are you sure to delete this user name" )) {
      const payload = {
        _id: policy._id
      }
      console.log("delete id availble here",payload)
      this.httpservice.post('http://localhost:3000/api/deletedata',payload).subscribe(res => { 
      console.log(res, 'delete result');
      this.router.navigate(['employees/holidays']);
      })
    }
  }

  searchID(val) {
    console.log(val);
    val = val.toString();                         // input value
    console.log("1 program data",this.Full);
    // this.Full.splice(0, this.Full.length);
    console.log("2 profgram",this.Full);
    let temp = this.Full.filter(function(d) {
      console.log("3 data",d.employeeID);    // database value
      d.employeeID = d.employeeID.toString();
      return d.employeeID.toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log(temp);
    this.rows.push(...temp);
    console.log(this.rows);
  }

  searchName(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function (d) {
      //console.log(d.userName);
      val = val.toLowerCase();
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchDesg(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function (d) {
      //console.log(d.designation);
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }
}
