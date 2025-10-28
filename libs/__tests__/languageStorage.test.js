import { getStoredLanguage, setStoredLanguage } from '../languageStorage.js';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('languageStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('setStoredLanguage', () => {
    it('should store the language in localStorage', () => {
      // Arrange
      const language = 'en';

      // Act
      setStoredLanguage(language);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith('language', language);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should store different languages correctly', () => {
      // Arrange
      const languages = ['en', 'hi', 'pa'];

      // Act & Assert
      languages.forEach(lang => {
        setStoredLanguage(lang);
        expect(localStorage.setItem).toHaveBeenCalledWith('language', lang);
      });

      expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('getStoredLanguage', () => {
    it('should return the stored language from localStorage', () => {
      // Arrange
      const storedLanguage = 'hi';
      localStorageMock.getItem.mockReturnValue(storedLanguage);

      // Act
      const result = getStoredLanguage();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('language');
      expect(result).toBe(storedLanguage);
    });

    it('should return "en" as default when no language is stored', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null);

      // Act
      const result = getStoredLanguage();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('language');
      expect(result).toBe('en');
    });

    it('should return "en" as default when localStorage returns empty string', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('');

      // Act
      const result = getStoredLanguage();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('language');
      expect(result).toBe('en');
    });
  });
});