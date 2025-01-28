import { Injectable, Inject, AfterViewInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {



  setItem(key: string, value: any): void {
      try {
        const valueToStore = JSON.stringify(value);  
        window.localStorage.setItem(key, valueToStore);  
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    
  }

  getItem<T>(key: string): T | null {
      try {
        const value = localStorage.getItem(key); 
        if (value) {
          return JSON.parse(value);  
        }
        return null;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
      }
  }

  removeItem(key: string): void {
      try {
        localStorage.removeItem(key);  
      } catch (error) {
        console.error('Error removing from localStorage', error);
      }
    
  }

  clear(): void {
      try {
        localStorage.clear();  // not required yet
      } catch (error) {
        console.error('Error clearing localStorage', error);
      }
    
  }

  contains(key: string): boolean {
      return localStorage.getItem(key) !== null;  //not required yet
  }
}
