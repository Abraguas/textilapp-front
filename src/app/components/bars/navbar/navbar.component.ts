import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string;
  private subscription: Subscription;
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) { }
  isLogged: boolean;
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.updateRole();
    this.sessionService.sessionChanged().subscribe({
      next: (valor: boolean) => {
        this.isLogged = valor;
        this.updateRole();
      }
    })
    if (localStorage.getItem('token')) {
      this.sessionService.changeState(true);
    } else {
      this.sessionService.changeState(false);
    }
  }
  updateRole(): void {
    this.subscription.add(
      this.userService.getRole().subscribe({
        next: (r: any) => {
          if (r.token && r.token.length > 0) {
            this.role = r.token;
          } else {
            this.role = 'NotLogged';
          }
        },
        error: (e) => {
          console.error(e);
          this.role = 'NotLogged';
        }
      })
    )
  }
}
