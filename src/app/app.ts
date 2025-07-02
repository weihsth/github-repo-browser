import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected header = 'GitHub Repo Browser';

  private readonly router = inject(Router);

  constructor() {
    this.initDeepLinks();
  }

  private initDeepLinks() {
    CapacitorApp.addListener('appUrlOpen', ({ url }: {url: string}) => {
      const parsed = new URL(url);
      const path = parsed.pathname;

      if (path.startsWith('/repo/')) {
        this.router.navigateByUrl(path);
      }
    });
  }
}
