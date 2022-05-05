import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CoordInfo {
	components: {
		city?: string;
		country?: string;
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

	private defaultInfo = {
		components: {},
		formatted: '',
		geometry: {
			lat: 0,
			lng: 0,
		},
	};

	private infoAboutFeatureSource = new BehaviorSubject<CoordInfo>(this.defaultInfo);

	infoAboutFeature$ = this.infoAboutFeatureSource.asObservable();

	setData(coords: Array<string>) {
		this.http
			.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${coords[0]}+${coords[1]}&key=${environment.OPENCAGE_API_KEY}`
			)
			.subscribe((data: any) => {
				this.infoAboutFeatureSource.next(data.results?.[0]);
			});
	}
}
