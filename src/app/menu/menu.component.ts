import { Component, OnInit } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { MapControlService } from '../service/map-control.service';
import { OpenCageService } from '../service/open-cage.service';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	constructor(private mapControl: MapControlService, private apiControl: OpenCageService) {}

	public info$ = this.apiControl.infoAboutFeature$;

	ngOnInit(): void {
		this.info$.pipe((data) => data);
	}

	deleteMapPath(): void {
		this.clearMapSource();
		this.clearMapOverlayPosition();
		localStorage.clear();
	}

	playMap() {
		const coordsList = JSON.parse(localStorage.getItem('coords') || '[]');
		if (coordsList) {
			this.clearMapOverlayPosition();
			const coords = coordsList.map((coords: Coordinate) => fromLonLat(coords));
			this.mapControl.featureLineString.getGeometry()?.setCoordinates(coords);
		}
	}

	clearMapSource(): void {
		this.mapControl.featurePoint.getGeometry()?.setCoordinates([]);
		this.mapControl.featureLineString.getGeometry()?.setCoordinates([]);
		this.apiControl.clearData();
	}

	clearMapOverlayPosition(): void {
		let overlay = this.mapControl.map.getOverlays().getArray();
		overlay[0].setPosition(undefined);
	}
}
