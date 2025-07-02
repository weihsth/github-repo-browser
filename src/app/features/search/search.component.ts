import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SearchFacade } from './search.facade';
import { Router, RouterLink } from '@angular/router';
import { GitHubRepo } from '../../core/interfaces/github-repo';
import { ScreenService } from '../../core/services/screen.service';
import { NgTemplateOutlet } from '@angular/common';
import { RepoDetailComponent } from '../repo-detail/repo-detail.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgTemplateOutlet,
    RepoDetailComponent
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  readonly screen = inject(ScreenService);
  readonly facade = inject(SearchFacade);
  readonly router = inject(Router);

  input = signal('');

  selected = signal<GitHubRepo | null>(null);

  private scrollListener = () => this.onScroll();

  private debounceTimer: any;

  constructor() {
    effect(() => {
      const val = this.input();

      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.facade.setQuery(val);
      }, 300);
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
  }

  onInput(event: Event) {
    this.input.set((event.target as HTMLInputElement).value);
  }

  onScroll() {
    const threshold = 300;
    const pos = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (height - pos < threshold && !this.facade.isLoading$()) {
      this.facade.loadMore();
    }
  }
}
