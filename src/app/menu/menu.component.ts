import { Component, OnInit } from '@angular/core';
import { MapControlService } from '../map-control.service';
import { OpenCageService } from '../open-cage.service';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	constructor(private mapControl: MapControlService, private httpService: OpenCageService) {}

	ngOnInit() {}

	deleteMapPath(): void {
		this.clearMapSource();
		this.clearMapOverlayPosition();
		localStorage.clear();

		// // долгота/широта
		// const hdms = toStringXY(toLonLat(featureCoords), 2);
		// console.log(features[0].getGeometry()?.getClosestPoint());
	}

	playMap() {
		this.httpService.getData().subscribe((data: any) => console.log(data));
	}

	clearMapSource(): void {
		const features = this.mapControl.source.getFeatures();

		if (features.length > 0) {
			this.mapControl.source.clear();
		}
	}

	clearMapOverlayPosition(): void {
		let overlay = this.mapControl.map.getOverlays().getArray();
		overlay[0].setPosition(undefined);
	}
}
