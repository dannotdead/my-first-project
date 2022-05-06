import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coordinate } from 'ol/coordinate';

export interface CoordInfo {
	components: {
		city?: string;
		country?: string;
		town?: string;
		village?: string;
		region?: string;
		state?: string;
	};
	formatted: string;
	geometry: {
		lat: number;
		lng: number;
	};
}

@Injectable({
	providedIn: 'root',
})
export class OpenCageService {
	constructor(private http: HttpClient) {}

	private infoAboutFeatureSource = new BehaviorSubject<CoordInfo | null>(null);

	infoAboutFeature$ = this.infoAboutFeatureSource.asObservable();

	setData(coords: Coordinate) {
		this.http
			.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${coords[0]}+${coords[1]}&key=${environment.OPENCAGE_API_KEY}`
			)
			.subscribe((data: any) => {
				this.infoAboutFeatureSource.next(data.results?.[0]);
			});
	}
}
