import { SpaterTvPage } from './app.po';

describe('spater-tv App', function() {
  let page: SpaterTvPage;

  beforeEach(() => {
    page = new SpaterTvPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
