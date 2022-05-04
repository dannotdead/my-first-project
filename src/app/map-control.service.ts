import { Injectable } from '@angular/core';
import Map from 'ol/Map';

@Injectable({
	providedIn: 'root',
})
export class MapControlService {
	private _map!: Map;

	public get map(): Map {
		return this._map;
	}

	public set map(value: Map) {
		this._map = value;
	}

	// object: map
	// method: clear map
	// при инициализации присваиваем туда карту в сервис и управляем ей отсюда
}
