import { Component, OnInit } from '@angular/core';
import { inAndOut } from 'ol/easing';
import { fromLonLat } from 'ol/proj';
import { MapControlService } from '../service/map-control.service';
import { OpenCageService } from '../service/open-cage.service';
import { interval, map, take } from 'rxjs';

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
			const mapView = this.mapControl.map.getView();
			this.mapControl.featurePoint.getGeometry()?.setCoordinates([]);
			this.mapControl.featureLineString.getGeometry()?.setCoordinates([]);
			this.clearMapOverlayPosition();

			interval(1500)
				.pipe(
					take(coordsList.length),
					map((index) => fromLonLat(coordsList[index]))
				)
				.subscribe((coords) => {
					mapView.animate({
						center: coords,
						easing: inAndOut,
						zoom: 5,
					});
					this.mapControl.featureLineString.getGeometry()?.appendCoordinate(coords);
					this.mapControl.featurePoint.getGeometry()?.setCoordinates(coords);
				});
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
