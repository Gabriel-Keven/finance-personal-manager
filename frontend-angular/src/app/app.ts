import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop'; // <-- NOVO IMPORT
import { map } from 'rxjs/operators';

// Angular Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 

import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterModule, 
    MatSidenavModule, MatToolbarModule, MatListModule, 
    MatIconModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private breakpointObserver = inject(BreakpointObserver);
  public authService = inject(AuthService);

  // 1. Sinal que sabe se a tela é de celular ou de PC
  public isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches)),
    { initialValue: false }
  );

  // 2. A Trava de Segurança: Só fecha a gaveta se for tela de celular
  fecharMenuNoCelular(drawer: any) {
    if (this.isHandset()) {
      drawer.close();
    }
  }
}