import { RepoDetailsFacade } from './repo-details.facade';
import { GitHubApiService } from '../../core/services/github-api.service';
import { GitHubRepo } from '../../core/interfaces/github-repo';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

jest.mock('../../core/services/github-api.service');

describe('RepoDetailsFacade', () => {
  let facade: RepoDetailsFacade;
  let apiMock: jest.Mocked<GitHubApiService>;

  const mockRepo: GitHubRepo = {
    id: 1,
    full_name: 'angular/angular',
    description: 'desc',
    stargazers_count: 100,
    forks_count: 50,
    html_url: '',
    owner: { login: '', avatar_url: '', html_url: '' },
  };

  beforeEach(() => {
    apiMock = {
      getRepoByFullName: jest.fn(),
      getRepoReadmeHtml: jest.fn(),
    } as any;

    (RepoDetailsFacade as any).prototype.api = apiMock;

    TestBed.configureTestingModule({
      providers: [
        RepoDetailsFacade,
        { provide: GitHubApiService, useValue: apiMock },
      ],
    });

    facade = TestBed.inject(RepoDetailsFacade);
  });

  it('should load repo and readme on success', () => {
    apiMock.getRepoByFullName.mockReturnValue(of(mockRepo));
    apiMock.getRepoReadmeHtml.mockReturnValue(of('<h1>README</h1>'));

    facade.load('angular/angular');

    expect(apiMock.getRepoByFullName).toHaveBeenCalledWith('angular/angular');
    expect(apiMock.getRepoReadmeHtml).toHaveBeenCalledWith('angular/angular');

    expect(facade.repo()).toEqual(mockRepo);
    expect(facade.readmeHtml()).toBe('<h1>README</h1>');
    expect(facade.isLoading()).toBe(false);
  });

  it('should handle error and fallback html', () => {
    apiMock.getRepoByFullName.mockReturnValue(throwError(() => new Error('fail')));
    apiMock.getRepoReadmeHtml.mockReturnValue(throwError(() => new Error('fail')));

    facade.load('angular/angular');

    expect(facade.repo()).toBeNull();
    expect(facade.readmeHtml()).toBe('<p>Fehler beim Laden des Repos.</p>');
    expect(facade.isLoading()).toBe(false);
  });
});
