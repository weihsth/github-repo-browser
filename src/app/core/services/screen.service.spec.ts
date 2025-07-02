import { ScreenService } from './screen.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    // Default auf Desktop-Breite
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    service = new ScreenService();
  });

  it('should detect desktop on init', () => {
    expect(service.isMobile()).toBe(false);
  });

  it('should detect mobile on init', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    const freshService = new ScreenService();
    expect(freshService.isMobile()).toBe(true);
  });

  it('should react to resize events', () => {
    expect(service.isMobile()).toBe(false);

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('resize'));

    expect(service.isMobile()).toBe(true);
  });
});
