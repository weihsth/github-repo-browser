import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchFacade } from './search.facade';
import { Router } from '@angular/router';
import { GitHubRepo } from '../../core/interfaces/github-repo';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;
  let facadeMock: jest.Mocked<SearchFacade>;

  beforeEach(async () => {
    facadeMock = {
      setQuery: jest.fn(),
      isLoading$: jest.fn().mockReturnValue(false),
      loadMore: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: SearchFacade, useValue: facadeMock },
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debounce input and call setQuery', fakeAsync(() => {
    const inputEl = document.createElement('input');
    inputEl.value = 'angular';

    component.onInput({ target: inputEl } as unknown as Event);
    expect(facadeMock.setQuery).not.toHaveBeenCalled();

    tick(300);
    expect(facadeMock.setQuery).toHaveBeenCalledWith('angular');
  }));

  it('should call loadMore on scroll near bottom', () => {
    Object.defineProperty(window, 'innerHeight', { value: 1000 });
    Object.defineProperty(window, 'scrollY', { value: 1500 });
    Object.defineProperty(document.body, 'scrollHeight', { value: 1850 });

    component.onScroll();
    expect(facadeMock.loadMore).toHaveBeenCalled();
  });

  it('should not call loadMore if already loading', () => {
    facadeMock.isLoading$.mockReturnValue(true);
    component.onScroll();
    expect(facadeMock.loadMore).not.toHaveBeenCalled();
  });
});
