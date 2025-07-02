import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  readonly isMobile = signal(window.innerWidth < 768);

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    });
  }
}
