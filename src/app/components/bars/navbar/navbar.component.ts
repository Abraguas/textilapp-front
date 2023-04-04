import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  role: string;
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.role = "ADMIN"
    }
  }

}
