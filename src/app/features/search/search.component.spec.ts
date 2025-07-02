import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchFacade } from './search.facade';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('SearchComponent (JEST)', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  // Mock Facade mit jest.fn()
  const facadeMock = {
    setQuery: jest.fn(),
    loadMore: jest.fn(),
    isLoading$: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  const screenServiceMock = {
    isMobile: signal(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: SearchFacade, useValue: facadeMock },
        { provide: Router, useValue: routerMock },
        { provide: 'ScreenService', useValue: screenServiceMock },
      ],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call loadMore onScroll when loading', () => {
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 700, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 2000, writable: true });

    facadeMock.isLoading$.mockReturnValue(true);

    component.onScroll();

    expect(facadeMock.loadMore).not.toHaveBeenCalled();
  });

  it('should add scroll listener on init and remove on destroy', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    component.ngOnInit();
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    component.ngOnDestroy();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
