import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';

@Injectable({
	providedIn: 'root',
})
export class MapControlService {
	private _map!: Map;
	private _source!: VectorSource;
	private _feature!: Feature<Point>;

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

	public get feature(): Feature<Point> {
		return this._feature;
	}

	public set feature(value: Feature<Point>) {
		this._feature = value;
	}
}
