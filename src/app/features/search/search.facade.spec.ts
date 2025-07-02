import { TestBed } from '@angular/core/testing';
import { SearchFacade } from './search.facade';
import { GitHubApiService } from '../../core/services/github-api.service';
import { of, throwError } from 'rxjs';
import { GitHubRepoSearchResult } from '../../core/interfaces/github-repo-search-result';

describe('SearchFacade', () => {
  let facade: SearchFacade;
  let apiMock: jest.Mocked<GitHubApiService>;

  const mockResult: GitHubRepoSearchResult = {
    total_count: 42,
    incomplete_results: false,
    items: [
      {
        id: 1,
        full_name: 'angular/angular',
        description: 'desc',
        stargazers_count: 100,
        forks_count: 50,
        html_url: '',
        owner: { login: '', avatar_url: '', html_url: '' },
      },
    ],
  };

  beforeEach(() => {
    apiMock = { searchRepos: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: GitHubApiService, useValue: apiMock },
        SearchFacade,
      ],
    });

    facade = TestBed.inject(SearchFacade);
  });

  it('should load search results', () => {
    apiMock.searchRepos.mockReturnValue(of(mockResult));

    facade.setQuery('angular');
    TestBed.flushEffects(); // ✅ Triggert effect()

    expect(apiMock.searchRepos).toHaveBeenCalledWith('angular', 1, 20);
    expect(facade.results$()).toEqual(mockResult.items);
    expect(facade.totalCount$()).toBe(42);
    expect(facade.isLoading$()).toBe(false);
  });

  it('should append results on loadMore()', () => {
    const page1 = mockResult;
    const page2: GitHubRepoSearchResult = {
      ...mockResult,
      items: [{ ...mockResult.items[0], id: 2, full_name: 'angular/cli' }],
    };

    apiMock.searchRepos
      .mockReturnValueOnce(of(page1))
      .mockReturnValueOnce(of(page2));

    facade.setQuery('angular');
    TestBed.flushEffects();
    facade.loadMore();
    TestBed.flushEffects();

    expect(facade.results$().length).toBe(2);
  });

  it('should reset results on empty query', () => {
    apiMock.searchRepos.mockReturnValue(of(mockResult));

    facade.setQuery('angular');
    TestBed.flushEffects();
    facade.setQuery('   ');
    TestBed.flushEffects();

    expect(facade.results$()).toEqual([]);
    expect(facade.totalCount$()).toBe(0);
  });

  it('should handle errors gracefully', () => {
    apiMock.searchRepos.mockReturnValue(throwError(() => new Error('fail')));

    facade.setQuery('angular');
    TestBed.flushEffects();

    expect(facade.isLoading$()).toBe(false);
    expect(facade.results$()).toEqual([]);
  });
});
