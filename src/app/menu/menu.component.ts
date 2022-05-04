import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

	playMap() {}

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
