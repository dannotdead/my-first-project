import { Component, OnInit } from '@angular/core';
import { MapControlService } from '../map-control.service';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	constructor(private mapControl: MapControlService) {}

	ngOnInit() {}

	deleteMapPath(): void {
		this.clearMapSource();

		// // долгота/широта
		// const hdms = toStringXY(toLonLat(featureCoords), 2);
		// console.log(features[0].getGeometry()?.getClosestPoint());
	}

	clearMapSource(): void {
		const features = this.mapControl.source.getFeatures();

		if (features.length > 0) {
			this.mapControl.source.clear();
		}
	}
}
