import { effect, Injectable, signal } from '@angular/core';
import { GitHubRepo } from '../../core/interfaces/github-repo';
import { GitHubApiService } from '../../core/services/github-api.service';

@Injectable({providedIn: 'root'})
export class SearchFacade {
  private query = signal('');
  private page = signal(1);
  private perPage = 20;

  private isLoading = signal(false);
  private totalCount = signal(0);
  private results = signal<GitHubRepo[]>([]);

  readonly results$ = this.results.asReadonly();
  readonly isLoading$ = this.isLoading.asReadonly();
  readonly totalCount$ = this.totalCount.asReadonly();

  constructor(private api: GitHubApiService) {
    effect(() => {
      const q = this.query();
      const p = this.page();

      if (!q.trim()) {
        this.results.set([]);
        this.totalCount.set(0);
        return;
      }

      this.isLoading.set(true);

      this.api.searchRepos(q, p, this.perPage).subscribe({
        next: (res) => {
          if (p === 1) {
            this.results.set(res.items);
          } else {
            this.results.update((prev) => [...prev, ...res.items]);
          }
          this.totalCount.set(res.total_count);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    });
  }

  setQuery(query: string) {
    this.query.set(query);
    this.page.set(1); // Reset bei neuer Suche
  }

  loadMore() {
    this.page.set(this.page() + 1);
  }
}
