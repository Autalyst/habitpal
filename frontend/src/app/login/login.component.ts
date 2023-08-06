import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  username = '';
  password = '';

  async login() {
    const loginSuccess = 
      await this.authService.login(this.username, this.password);

    if (loginSuccess) {
      this.router.navigate([
        this.route.snapshot.queryParamMap.get('return')
      ]);
    }

    // todo test this, test error handling, test everything
  }
}
