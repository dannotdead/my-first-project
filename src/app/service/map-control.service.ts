import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';

@Injectable({
	providedIn: 'root',
})
export class MapControlService {
	private _map!: Map;
	private _source!: VectorSource;
	private _featurePoint!: Feature<Point>;
	private _featureLineString!: Feature<LineString>;

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

	public get featurePoint(): Feature<Point> {
		return this._featurePoint;
	}

	public set featurePoint(value: Feature<Point>) {
		this._featurePoint = value;
	}

	public get featureLineString(): Feature<LineString> {
		return this._featureLineString;
	}

	public set featureLineString(value: Feature<LineString>) {
		this._featureLineString = value;
	}
}
