import { Injectable, Inject, AfterViewInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {



  // Guardar un valor en localStorage solo si estamos en el navegador
  setItem(key: string, value: any): void {
      try {
        const valueToStore = JSON.stringify(value);  // Convertimos el valor a JSON
        window.localStorage.setItem(key, valueToStore);  // Guardamos en localStorage
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    
  }

  // Obtener un valor desde localStorage solo si estamos en el navegador
  getItem<T>(key: string): T | null {
      try {
        const value = localStorage.getItem(key);  // Obtenemos el valor de localStorage
        if (value) {
          return JSON.parse(value);  // Convertimos el valor de JSON a objeto
        }
        return null;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
      }
  }

  // Eliminar un item de localStorage solo si estamos en el navegador
  removeItem(key: string): void {
      try {
        localStorage.removeItem(key);  // Eliminamos el item de localStorage
      } catch (error) {
        console.error('Error removing from localStorage', error);
      }
    
  }

  // Limpiar todos los items de localStorage solo si estamos en el navegador
  clear(): void {
      try {
        localStorage.clear();  // Limpiamos todos los items en localStorage
      } catch (error) {
        console.error('Error clearing localStorage', error);
      }
    
  }

  // Verificar si un item existe en localStorage solo si estamos en el navegador
  contains(key: string): boolean {
      return localStorage.getItem(key) !== null;  // Verificamos si existe el item
  }
}
