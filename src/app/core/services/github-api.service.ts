import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubRepoSearchResult } from '../interfaces/github-repo-search-result';
import { catchError, of } from 'rxjs';
import { GitHubRepo } from '../interfaces/github-repo';

@Injectable({ providedIn: 'root' })
export class GitHubApiService {
  private reposSearchBaseUrl = 'https://api.github.com/search/repositories';
  private repoBaseUrl = 'https://api.github.com/repos';
  private repoReadmeBaseUrl = 'https://api.github.com/repos';

  constructor(private http: HttpClient) {}

  searchRepos(query: string, page: number = 1, perPage: number = 20, sort: string = 'stars', order: 'asc' | 'desc' = 'desc') {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('sort', sort)
      .set('order', order);

    return this.http.get<GitHubRepoSearchResult>(this.reposSearchBaseUrl, { params });
  }

  getRepoByFullName(fullName: string) {
    const url = `${this.repoBaseUrl}/${fullName}`;
    return this.http.get<GitHubRepo>(url);
  }

  getRepoReadmeHtml(fullName: string) {
    const url = `${this.repoReadmeBaseUrl}/${fullName}/readme`;

    return this.http.get(url, {
      headers: { Accept: 'application/vnd.github.v3.html' },
      responseType: 'text',
    }).pipe(
      catchError(() => of('<p>README konnte nicht geladen werden.</p>'))
    );
  }
}
