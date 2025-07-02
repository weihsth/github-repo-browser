import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GitHubApiService } from '../../core/services/github-api.service';
import { GitHubRepo } from '../../core/interfaces/github-repo';

@Injectable({providedIn: 'root'})
export class RepoDetailsFacade {
  private readonly api = inject(GitHubApiService);

  readonly repo = signal<GitHubRepo | null>(null);
  readonly readmeHtml = signal<string | null>(null);
  readonly isLoading = signal(false);

  load(fullName: string) {
    this.isLoading.set(true);

    forkJoin({
      repo: this.api.getRepoByFullName(fullName),
      readme: this.api.getRepoReadmeHtml(fullName),
    }).subscribe({
      next: ({ repo, readme }) => {
        this.repo.set(repo);
        this.readmeHtml.set(readme);
        this.isLoading.set(false);
      },
      error: () => {
        this.repo.set(null);
        this.readmeHtml.set('<p>Fehler beim Laden des Repos.</p>');
        this.isLoading.set(false);
      },
    });
  }
}
