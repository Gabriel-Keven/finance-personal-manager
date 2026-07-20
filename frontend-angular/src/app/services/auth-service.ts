import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  private apiUrl = `${environment.apiUrl}/auth`;

  // 1. A MÁGICA: O estado de login agora é um Sinal reativo!
  public loggedIn = signal<boolean>(this.checkToken());

  // Função interna apenas para ler o crachá na primeira carga da página
  private checkToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwt_token');
    }
    return false;
  }

  public login(credentials: any) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('jwt_token', response.token);
          this.loggedIn.set(true); // 2. Avisa o sistema inteiro instantaneamente!
        }
      })
    );
  }

  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      this.loggedIn.set(false); // 3. Avisa que saiu
    }
    this.router.navigate(['/login']);
  }
}