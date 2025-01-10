import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $:any;

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  public myDatePickerOptionsT: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '48px'
  };

  public myDatePickerOptionsF: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '48px'
  };

  public myDatePickerOptions1: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };
  
  rows = [];
  Emp:any;
  Full:any;

  public srch = [];
  public addL:any = {};
  addLeaveValidation:boolean = false;
  Pwd: any;

  constructor(private appService:AppService,private router:Router,private route:ActivatedRoute,private httpservice: HttpClient) { 
    this.rows = appService.leaves;
    this.srch = [...this.rows];
  }

  ngOnInit() {
    
    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    this.getFullname();
    // this.getLeaveRequest();
    var date1 = new Date("7/13/2010");
    var date2 = new Date("7/11/2010");
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    console.log(diffDays);
  }

  getFullname() {
    this.httpservice.get('http://localhost:3000/api/postLeaveRequest').subscribe(user => {
      this.Emp = user;  
      console.log("Angularjs", this.Emp);
      let dataStore = []
      console.log("getFullname datastore", dataStore)
      console.log("getFullname Name ", this.Emp['data'][0]['employeeName'])
      var i;
      for (i = 0; i < this.Emp['data'].length; ++i) {
        let xyzabcd = []
        var j
        for (j = 0; j < this.Emp['data'][i]['from'].length; ++j) {
          xyzabcd.push({ 
            'from': this.Emp['data'][i]['from'][j]['formatted'],
            'to': this.Emp['data'][i]['to'][j]['formatted']
            
        })
        }
        dataStore.push({
          '_id': this.Emp['data'][i]['_id'],
          'employeeName': this.Emp['data'][i]['employeeName'],
          'employeePos': this.Emp['data'][i]['employeePos'],
          'leaveType': user['data'][i]['leaveType'],
          'days': user['data'][i]['days'],
          'reason': user['data'][i]['reason'],
          'employeeModules': xyzabcd
        })
      }
      this.Full = dataStore;
      console.log(this.Full, "getFullname dataStore value")
    })
  }

  // getLeaveRequest() {
  //   this.httpservice.get('http://localhost:3000/api/postleaveRequestdata').subscribe(data => {
  //     this.Pwd = data;  
  //     console.log("pwd data", this.Pwd);
  //     let Storedata = []
  //     console.log("getLeaveRequest storedata", Storedata)
  //     console.log("getLeaveRequest Name ", this.Pwd['data'][0]['leave_type'])
  //     var i;
  //     for (i = 0; i < this.Pwd['data'].length; ++i) {
  //       Storedata.push({
  //         '_id': this.Pwd['data'][i]['_id'],
  //         'leave_type': this.Pwd['data'][i]['leave_type'],
  //         'number_of_days': this.Pwd['data'][i]['number_of_days'],
          
  //       })
  //     }
  //     this.Full = Storedata;
  //     console.log(this.Full, "getLeaveRequest Storedata value")
  //   })
  // }

  addReset(){
    this.addL = {'days':2,'status':'New'};
    $('#add_leave').modal('show');
  }

  addLeave(f)
  {
    //console.log(f.form.value);
    let randomnumber = Math.floor(Math.random() * 99);
    f.form.value.leave_id = randomnumber;
    if (f.invalid === true)
      this.addLeaveValidation = true;
    else {
      this.addLeaveValidation = false;
      this.rows.unshift(f.form.value);
      this.srch.unshift(f.form.value);
      this.rows = this.rows;
      $('#add_leave').modal('hide');
      }

      var myJSON = JSON.stringify(f.value);
      $.ajax({
        url: "http://localhost:3000/api/postLeaveRequest",
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

  onEdit(policy){
    console.log("Ujjian Indore Bhopal");
    this.router.navigate(['employees/leaves/edit'], { queryParams: { 'id': policy._id } });
  }

  searchType(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.leaveType);
      val = val.toLowerCase();
      return d.leaveType.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchName(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.employeeName);
      val = val.toLowerCase();
      return d.employeeName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchStatus(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.status);
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  onDelete(item) {
    if (confirm("Are you sure to delete this user name" )) {
      const payload = {
        _id: item._id
      }
 
      this.httpservice.post('http://localhost:3000/api/deleteLeaveRequest',payload).subscribe(res => { 
      console.log(res, 'delete result');
      window.location.reload();
      })
    }
  }
}
