import { Component, OnInit } from '@angular/core';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style } from 'ol/style';
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
			this.clearMapSource();
			this.clearMapOverlayPosition();

			const layers = this.mapControl.map.getAllLayers();
			if (layers[2]) {
				this.mapControl.map.removeLayer(layers[2]);
			}

			const coords = coordsList.map((coords: string) => this.addPoints(coords));

			this.mapControl.map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: [
							new Feature({
								geometry: new LineString(coords),
							}),
						],
					}),
					style: new Style({
						stroke: new Stroke({
							width: 2,
							color: '#ff0000',
						}),
					}),
				})
			);

			coords.map((coord: number[]) => {
				this.mapControl.source.addFeature(
					new Feature({
						geometry: new Point(coord),
					})
				);
			});
		}
	}

	addPoints(rawCoords: string) {
		const coords = rawCoords
			.split(', ')
			.map((coord) => parseFloat(coord))
			.reverse();

		return fromLonLat(coords);
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
