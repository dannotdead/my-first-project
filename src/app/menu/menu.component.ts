import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { MapControlService } from '../service/map-control.service';
import { OpenCageService } from '../service/open-cage.service';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
	@ViewChild('infoAboutFeatures') infoAboutFeatures!: ElementRef;

	constructor(private mapControl: MapControlService, private apiControl: OpenCageService) {}

	ngOnInit(): void {
		this.apiControl.infoAboutFeature$.subscribe((response) => {
			this.infoAboutFeatures.nativeElement.innerHTML = `<p>${response}</p>`;
		});
	}

	deleteMapPath(): void {
		this.clearMapSource();
		this.clearMapOverlayPosition();
		this.infoAboutFeatures.nativeElement.innerHTML = ``;
		localStorage.clear();
	}

	playMap() {
		const coordsList = localStorage.getItem('coords')?.split(';');
		if (coordsList) {
			this.clearMapSource();
			this.clearMapOverlayPosition();
			coordsList.map((coords) => this.addPoints(coords));
		}
	}

	addPoints(rawCoords: string) {
		const coords = rawCoords
			.split(', ')
			.map((coord) => parseFloat(coord))
			.reverse();

		this.mapControl.source.addFeature(
			new Feature({
				geometry: new Point(fromLonLat(coords)),
			})
		);
		console.log(coords);
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
