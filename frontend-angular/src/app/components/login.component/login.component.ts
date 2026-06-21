import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public email = signal('');
  public password = signal('');

  fazerLogin() {
    if (!this.email() || !this.password()) return;

    const credentials = { email: this.email(), password: this.password() };

    this.authService.login(credentials).subscribe({
      next: () => {
        // Sucesso! Redireciona para o balanço ou extrato
        this.router.navigate(['/balance']); 
      },
      error: () => {
        this.snackBar.open('E-mail ou senha incorretos!', 'Fechar', { 
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-erro']
        });
      }
    });
  }
}