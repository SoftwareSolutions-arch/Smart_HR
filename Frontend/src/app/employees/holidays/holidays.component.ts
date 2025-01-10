import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $: any;

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false
  };

  rows = [];
  Full: any;
  Emp: any;
  public srch = [];
  public addD: any = {};
  addHolidayValidation: boolean = false;
  // modify:boolean = false;

  constructor(private appService: AppService, private router: Router, private route: ActivatedRoute, private httpservice: HttpClient) {
    this.rows = appService.holidays;
    this.srch = [...this.rows];

  }

  ngOnInit() {
    this.getNamedata();
  }

  getNamedata() {
    console.log("Hello from getNamedata");
    this.httpservice.get('http://localhost:3000/api/postholidays').subscribe(user => {
      this.Emp = user;
      console.log("finally i am inside ", this.Emp);
      let dataStore = []
      var i;
      for (i = 0; i < user['data'].length; ++i) {
        let xyzabcd = []
        var j
        for (j = 0; j < this.Emp['data'][i]['date'].length; ++j) {
          xyzabcd.push({ 
            'date': this.Emp['data'][i]['date'][j]['formatted']
           })
        }
        dataStore.push({
          '_id': this.Emp['data'][i]['_id'],
          'title': this.Emp['data'][i]['title'],
          'date': xyzabcd,
          'day': this.Emp['data'][i]['day'],
        })
      }
      this.Full = dataStore;
      console.log("dataStore value", this.Full)
    })
  }

  addReset() {
    this.addD = {};
    $('#add_holiday').modal('show');
  }

  getDayOfWeek(date) {
    //console.log(date);
    var dayOfWeek = new Date(date).getDay();
    //console.log(dayOfWeek)
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  addHoliday(f) {
    let randomnumber = Math.floor(Math.random() * 99);
    f.form.value.holiday_id = randomnumber;
    if (f.invalid === true)
      this.addHolidayValidation = true;
    else {
      this.addHolidayValidation = false;
      let d = f.form.value.date.formatted.split('-');
      let align_date = "" + d[2] + "-" + d[1] + "-" + d[0];
      f.form.value.day = this.getDayOfWeek(align_date);
      f.form.value.status = "upcoming";
      //console.log(f.form.value.day);
      this.rows.unshift(f.form.value);
      this.srch.unshift(f.form.value);
      this.rows = this.rows;
      $('#add_holiday').modal('hide');
      //console.log(this.rows);
    }

    var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/postholidays",
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

  onEdit(item) {
    // this.modify=true
    // this.router.navigate(['employees/holidays/edit'], { queryParams: { 'id': item.holiday_id } });
  }

  // onDelete(item) {
  //   //console.log("="+id+"=");

  //   var index = this.rows.findIndex(function (item, i) {
  //     return item.holiday_id === item
  //   });

  //   //console.log(index);
  //   if (index > -1) {
  //     this.rows.splice(index, 1);
  //     this.srch.splice(index, 1);
  //   }
  //   //console.log(this.rows);
  //   this.rows = this.rows;
  // }

  onDelete(item) {
    if (confirm("Are you sure to delete this user name" )) {
      const payload = {
        _id: item._id
      }
      console.log("delete id availble here",payload)
      this.httpservice.post('http://localhost:3000/api/deleteholiday',payload).subscribe(res => { 
      console.log(res, 'delete result');
      window.location.reload();
      })
    }
  }


}
