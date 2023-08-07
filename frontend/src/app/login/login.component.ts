import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.logout();
  }

  username: string = '';
  password: string = '';
  
  errorMessages: Array<string> = [];
  showServerError: boolean = false;

  login() {
    this.authService
      .login(this.username, this.password)
      .subscribe({
        next: () => {
          const returnRoute = this.route.snapshot.queryParamMap.get('return') ?? 'app/home';
          this.router.navigate([returnRoute]);
        },
        error: (result) => {
          if (result.status == 403) {
            this.errorMessages = [result.error.message];
          } else {
            this.errorMessages = result.error.message;
          }

          this.showServerError = true;
        }
      });
  }
}
