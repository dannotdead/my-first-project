import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OpenCageService {
	constructor(private http: HttpClient) {}

	private infoAboutFeatureSource = new Subject<Array<string>>();

	infoAboutFeature$ = this.infoAboutFeatureSource.asObservable();

  // лишний
	updateFeatureInfo(value: Array<string>) {
		this.infoAboutFeatureSource.next(value);
	}

  // setdata
  // сейвит в переменную
	getData(coords: Array<string>) {
		return this.http.get(
			`https://api.opencagedata.com/geocode/v1/json?q=${coords[0]}+${coords[1]}&key=${environment.OPENCAGE_API_KEY}`
		);
	}
}
