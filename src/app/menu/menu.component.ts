import { Component, OnInit } from '@angular/core';
import { inAndOut } from 'ol/easing';
import { fromLonLat } from 'ol/proj';
import { MapControlService } from '../service/map-control.service';
import { OpenCageService } from '../service/open-cage.service';
import { interval, map, Subscription, take } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import { View } from 'ol';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	constructor(private mapControl: MapControlService, private apiControl: OpenCageService) {}

	public info$ = this.apiControl.infoAboutFeature$;
	private subscription: Subscription = Subscription.EMPTY;

	ngOnInit(): void {
		this.info$.pipe((data) => data);
	}

	deleteMapPath(): void {
		this.clearMapSource();
		this.clearMapOverlayPosition();
		localStorage.clear();
		this.subscription?.unsubscribe();
	}

	playMap() {
		const coordsList = JSON.parse(localStorage.getItem('coords') || '[]');
		const mapView = this.mapControl.map.getView();

		if (coordsList.length && this.subscription?.closed) {
			this.mapControl.featurePoint.getGeometry()?.setCoordinates([]);
			this.mapControl.featureLineString.getGeometry()?.setCoordinates([]);
			this.clearMapOverlayPosition();
			this.animation(coordsList.shift(), mapView);
			this.subscription = interval(1500)
				.pipe(
					take(coordsList.length),
					map((index) => coordsList[index])
				)
				.subscribe((coords) => {
					this.animation(coords, mapView);
				});
		} else {
			this.subscription.unsubscribe();
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

	animation(coords: Coordinate, mapView: View): void {
		const coordsLonLat = fromLonLat(coords);
		this.mapControl.featureLineString.getGeometry()?.appendCoordinate(coordsLonLat);
		this.mapControl.featurePoint.getGeometry()?.setCoordinates(coordsLonLat);
		mapView.animate({
			center: coordsLonLat,
			easing: inAndOut,
			zoom: 5,
		});
	}
}
