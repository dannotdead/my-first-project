import { Injectable } from '@angular/core';
import Map from 'ol/Map';

@Injectable({
  providedIn: 'root'
})
export class MapControlService {

  private mapSubject!: Map;

  setData(newValue: Map) {
    this.mapSubject = newValue;
  }

  getMap() {
    return this.mapSubject
  }
  // object: map
  // method: clear map
  // при инициализации присваиваем туда карту в сервис и управляем ей отсюда
}
