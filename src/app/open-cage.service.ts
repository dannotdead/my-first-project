import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { env } from 'process';

@Injectable({
	providedIn: 'root',
})
export class OpenCageService {
	constructor(private http: HttpClient) {}

	getData() {
		return this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=55.77+37.59&key=API_KEY`);
	}
}
