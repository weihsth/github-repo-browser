import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GitHubApiService } from './github-api.service';

describe('GitHubApiService', () => {
  let service: GitHubApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GitHubApiService],
    });

    service = TestBed.inject(GitHubApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch GitHub repositories', () => {
    service.searchRepos('angular', 1, 10).subscribe((result) => {
      expect(result.items.length).toBe(1);
      expect(result.items[0].full_name).toBe('angular/angular');
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'https://api.github.com/search/repositories'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          full_name: 'angular/angular',
          description: 'Angular framework',
          stargazers_count: 100,
          forks_count: 50,
          owner: {
            login: 'angular',
            avatar_url: '',
            html_url: '',
          },
          html_url: '',
        },
      ],
    });
  });

  it('should fetch repo details by full name', () => {
    service.getRepoByFullName('angular/angular').subscribe((repo) => {
      expect(repo.full_name).toBe('angular/angular');
    });

    const req = httpMock.expectOne('https://api.github.com/repos/angular/angular');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 1,
      full_name: 'angular/angular',
      description: 'Angular framework',
      stargazers_count: 100,
      forks_count: 50,
      owner: {
        login: 'angular',
        avatar_url: '',
        html_url: '',
      },
      html_url: '',
    });
  });

  it('should return readme html as text', () => {
    service.getRepoReadmeHtml('angular/angular').subscribe((html) => {
      expect(html).toBe('<h1>README</h1>');
    });

    const req = httpMock.expectOne('https://api.github.com/repos/angular/angular/readme');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');
    expect(req.request.headers.get('Accept')).toBe('application/vnd.github.v3.html');
    req.flush('<h1>README</h1>', { status: 200, statusText: 'OK' });
  });

  it('should return fallback html on readme fetch error', () => {
    service.getRepoReadmeHtml('angular/angular').subscribe((html) => {
      expect(html).toContain('README konnte nicht geladen werden');
    });

    const req = httpMock.expectOne('https://api.github.com/repos/angular/angular/readme');
    req.flush('error', { status: 404, statusText: 'Not Found' });
  });
});
