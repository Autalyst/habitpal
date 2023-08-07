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

  username = '';
  password = '';

  async login() {
    const loginSuccess = 
      await this.authService.login(this.username, this.password);

    if (loginSuccess) {
      const returnRoute = this.route.snapshot.queryParamMap.get('return') ?? 'app/home';
      this.router.navigate([returnRoute]);
    }

    // todo test this, test error handling, test everything
  }
}
