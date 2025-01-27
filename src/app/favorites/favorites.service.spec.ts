import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { StorageService } from '../services/storage.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    // mock StorageService
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);

    // setup TestBed
    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });
    service = TestBed.inject(FavoritesService);
  });

  // test case: getFavorites
  it('should return an empty array if no favorites are stored', () => {
    storageServiceMock.getItem.and.returnValue(null); // favorites empty

    const result = service.getFavorites();
    expect(result).toEqual([]); // should return empty array
  });

  it('should return the stored favorites', () => {
    const mockFavorites = ['London', 'Paris'];
    storageServiceMock.getItem.and.returnValue(mockFavorites); // full favorites

    const result = service.getFavorites();
    expect(result).toEqual(mockFavorites); // should return favorites
  });

  // test case: addFavorite
  it('should add a new favorite city and avoid duplicates', () => {
    const mockCity = 'Berlin';
    const mockFavorites: string[] = ['London', 'Paris', 'Berlin']; // "Berlin" is in the list
    storageServiceMock.getItem.and.returnValue(mockFavorites); // full favorites
  
    service.addFavorite(mockCity); // trying to add "Berlin" again
  
    // check duplicates
    expect(storageServiceMock.setItem).toHaveBeenCalledWith('favorites', JSON.stringify(mockFavorites));
  });

  // test case: removeFavorite
  it('should remove a favorite city', () => {
    const mockCity = 'Paris';
    const mockFavorites: string[] = ['London', 'Paris', 'Berlin'];
    storageServiceMock.getItem.and.returnValue(mockFavorites); // full favorites

    service.removeFavorite(mockCity);

    // check setItem and removed favorite
    const updatedFavorites = ['London', 'Berlin'];
    expect(storageServiceMock.setItem).toHaveBeenCalledWith('favorites', updatedFavorites);
  });

  it('should not remove a city that is not in the favorites', () => {
    const mockCity = 'Madrid';
    const mockFavorites: string[] = ['London', 'Paris', 'Berlin'];
    storageServiceMock.getItem.and.returnValue(mockFavorites); 

    service.removeFavorite(mockCity);

    expect(storageServiceMock.setItem).toHaveBeenCalledWith('favorites', mockFavorites);
  });
});
