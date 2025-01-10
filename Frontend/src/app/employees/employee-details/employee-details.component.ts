import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  id: any;
  uptEmployeeValidation: boolean = false;
  errorMsg = '';

  loginForm: FormGroup = new FormGroup({
    firstName: new FormControl(null,Validators.required),
    lastName: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required),
    cPassword: new FormControl(null,Validators.required),
    employeeID: new FormControl(null,Validators.required),
    joinDate: new FormControl(null,Validators.required),
    company: new FormControl(null,Validators.required),
    designation: new FormControl(null,Validators.required),
    phone: new FormControl(null,Validators.required),
    userName: new FormControl(null,Validators.required),
    email: new FormControl(null,Validators.required)
  });

  constructor(private httpservice: HttpClient, private http: HttpClient,
    private appservice: AppService,
    private router: Router) {

  }


  ngOnInit() {
    const value = this.appservice.getdata();
    console.log("value ", value);
    this.loginForm.patchValue(value);
  }

  // updateSubmit(){

  //   // if (f.invalid === true)
  //   //   this.uptEmployeeValidation = true;
  //   // else {
  //   //   this.uptEmployeeValidation = false;
  //   // this.userService.postUser(this.loginForm.value).subscribe(res => {
  //     console.log("data user  ", this.loginForm.value);

  //   let value = {}
  //   value = this.loginForm.value;
  //   value['_id'] = localStorage.getItem('employee_id')
  //   // const payload = {
  //   // id :localStorage.getItem('employee_id')
  //   // }
  //   console.log(value,"value aayi ki nahi pta karo bhai", this.loginForm.value)
  //     this.httpservice.post('http://localhost:3000/api/updatecreatedata',this.loginForm.value).subscribe(res => {
  //       console.log(res, 'update result');
  //     });
  // }

  updateSubmit() {
    if (this.loginForm.value) {
      const value = this.loginForm.value;
      value['_id'] = localStorage.getItem('employee_id')
      this.http.post('http://localhost:3000/api/updatecreatedata', value).subscribe(res => {
        console.log(res);
        this.router.navigate(['employees/all-employees']);
      });
    }
    else {
      this.errorMsg = 'All Fields are required'
    }
  }
}
