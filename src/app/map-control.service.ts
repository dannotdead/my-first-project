import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';

@Injectable({
	providedIn: 'root',
})
export class MapControlService {
	private _map!: Map;
	private _source!: VectorSource;

	public get map(): Map {
		return this._map;
	}

	public set map(value: Map) {
		this._map = value;
	}

	public get source(): VectorSource {
		return this._source;
	}

	public set source(value: VectorSource) {
		this._source = value;
	}

	// object: map
	// method: clear map
	// при инициализации присваиваем туда карту в сервис и управляем ей отсюда
}
