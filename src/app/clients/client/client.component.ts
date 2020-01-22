import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { AppService } from 'src/app/app.service';
import { Router,ActivatedRoute } from '@angular/router';

declare const $:any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '48px'
  };

  public allClients:boolean = true;
  public rows = [];
  Emp:any;
  Full:any;

  public srch = [];
  
  public addC:any = {};
  public uptC = [];
  public viewP = [];
  public uptP = [];
  addClientValidation:boolean = false;

  constructor(private clientService:AppService,private router:Router,private httpservice: HttpClient) { 
    this.rows = clientService.clients;
    this.srch = [...this.rows];
    this.getFullname();
  }

  getFullname() {
    this.httpservice.get('http://localhost:3000/api/postclientrouter').subscribe(user => {
      this.Emp = user;
      console.log("Angularjs", this.Emp);
      let dataStore = []
      console.log("welcome sir how may i help you!!!!", dataStore)
      console.log("Name ", this.Emp['data'][0]['firstName'])
      var i;
      for (i = 0; i < this.Emp['data'].length; ++i) { 
        // let xyzabcd = []
        // var j
        // for (j = 0; j < this.Emp['data'][i]['employee_modules'].length; ++j) {
        //   xyzabcd.push({ 'module': this.Emp['data'][i]['employee_modules'][j]['module'] })
        // }
        dataStore.push({
          '_id': this.Emp['data'][i]['_id'],
          'firstName': this.Emp['data'][i]['firstName'],
          'lastName': this.Emp['data'][i]['lastName'],
          'contactPerson': user['data'][i]['contactPerson'],
          'email': user['data'][i]['email'],
          'password': user['data'][i]['password'],
          'cPassword': user['data'][i]['cPassword'],
          'clientID': user['data'][i]['clientID'],
          'mobile': user['data'][i]['mobile'],
          'companyName': user['data'][i]['companyName'],
          'status': user['data'][i]['status'],
          // 'employeeModules': xyzabcd
        })
      }
      this.Full = dataStore;
      console.log(this.Full, "dataStore value")
    })
  }

  ngOnInit() {

    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

  }

  addReset(){
    let randomnumber = Math.floor(Math.random() * 99);
    this.addC = {'clientID':randomnumber};
    $('#add_client').modal('show');
  }

  addClient(f)
  {
    //console.log(f.form.value);
    if (f.invalid === true)
      this.addClientValidation = true;
    else 
    {
      this.addClientValidation = false;
    f.form.value.status = 'Active';
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#add_client').modal('hide');
    }

     var myJSON = JSON.stringify(f.value);
    $.ajax({
      url: "http://localhost:3000/api/postclientrouter",
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
    this.router.navigate(['clients/edit'], { queryParams: { 'id': item.clientID } });
  }

  // onDelete(Full){
  //   //console.log("="+c.clientID+"=");
  //   var index = this.rows.findIndex(function(item, i){
  //     return item.clientID === Full.clientID
  //   });
   
  //   console.log("I am Here bro where are you searching",index);
  //   if (index > -1) {
  //       this.rows.splice(index, 1);
  //       this.srch.splice(index, 1);
  //   }        
  //   //console.log(this.rows);
  //   this.rows = this.rows;
  //   $.ajax({
  //     url: "http://localhost:3000/api/deleteClientsRequest",
  //     type: 'POST',
  //     data: index,
  //     contentType: "application/json",
  //     dataType: 'json',
  //     success: function (response) {
  //       console.log(response);
  //     },
  //     error: function (response) {
  //       console.log(response);
  //     }
  //   });
  // }

  onDelete(item) {
    if (confirm("Are you sure to delete this user name")) {
      const payload = {
        _id: item._id
      }
      console.log("delete id availble here", payload)
      this.httpservice.post('http://localhost:3000/api/deleteClientsRequest', payload).subscribe(res => {
        console.log(res, 'delete result');
         window.location.reload();
      })
    }
  }

  searchID(Full) {
    //console.log(val);
    Full = Full.toString();
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.clientID);
      d.clientID = d.clientID.toString();
      return d.clientID.indexOf(Full) !== -1 || !Full;
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
      //console.log(d.contactPerson);
      val = val.toLowerCase();
      return d.contactPerson.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchCompany(val) {
    //console.log(val);
    //console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.companyName);
      val = val.toLowerCase();
      return d.companyName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    this.rows.push(...temp);
    //console.log(this.rows);
  }

  viewProfile(item)
  {
    this.router.navigate(['clients/profile/details'], { queryParams: { 'id': item.clientID } });
  }
  
}
