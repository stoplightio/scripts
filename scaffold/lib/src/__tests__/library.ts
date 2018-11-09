import { Library } from '../library';

describe('library', () => {
  let library: Library;

  beforeEach(() => {
    library = new Library();
  });

  test('should work', () => {
    expect(library.run()).toEqual(true);
  });
});
