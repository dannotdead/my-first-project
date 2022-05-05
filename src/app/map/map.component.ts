import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import { Coordinate, toStringXY } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import { defaults } from 'ol/control';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { MapControlService } from '../service/map-control.service';
import { OpenCageService } from '../service/open-cage.service';
import PointerInteraction from 'ol/interaction/Pointer';

@Component({
	selector: 'map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
	@ViewChild('popupContent') popupContent!: ElementRef;
	@ViewChild('popupMain') popupMain!: ElementRef;
	@ViewChild('popupCloser') popupCloser!: ElementRef;

	private map!: Map;
	private coordsItem = 'coords';

	constructor(private mapControl: MapControlService, private apiControl: OpenCageService) {}

	newFeature(coords: Array<number>): Feature {
		return new Feature({
			geometry: new Point(coords),
		});
	}

	private source = new VectorSource({});

	private style = new Style({
		image: new Icon({
			crossOrigin: 'anonymous',
			src: 'assets/icon-location30.png',
		}),
	});

	private vectorLayer = new VectorLayer({
		source: this.source,
		style: this.style,
	});

	private pointer = new PointerInteraction({});

	ngOnInit(): void {
		this.map = new Map({
			view: new View({
				center: [0, 0],
				zoom: 1,
			}),
			controls: defaults({
				attribution: false,
				zoom: false,
				rotate: false,
			}),
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
				this.vectorLayer,
			],
			target: 'ol-map',
		});

		this.mapControl.map = this.map;
		this.mapControl.source = this.source;

		this.map.on('singleclick', (event) => {
			const features = this.source.getFeatures();
			const coordinate = event.coordinate;
			const feature = this.map.getFeaturesAtPixel(event.pixel)[0];

			if (features.length === 0) {
				this.source.addFeature(this.newFeature(coordinate));
				localStorage.setItem(this.coordsItem, JSON.stringify([]));
			}

			if (feature) {
				const [featureCoords, hdms] = this.getFeatureCoords(features[0], coordinate);
				this.popupContent.nativeElement.innerHTML = `<p>You clicked here (lon, lat):</p><code>${hdms}</code>`;

				const overlays = this.map.getOverlays().getArray();
				overlays[0].setPosition(featureCoords);
			} else {
				this.source.clear();
				const newFeature = this.newFeature(coordinate);
				this.source.addFeature(newFeature);
				const [, hdms] = this.getFeatureCoords(newFeature, coordinate);

				this.apiControl.setData(hdms.split(', '));

				const coords = localStorage.getItem(this.coordsItem) || '[]';
				const newCoords = [...JSON.parse(coords), hdms];
				localStorage.setItem(this.coordsItem, JSON.stringify(newCoords));
				this.closePopup();
			}
		});

		this.map.on('pointermove', (event) => {
			if (this.map.hasFeatureAtPixel(event.pixel)) {
				this.map.getViewport().style.cursor = 'pointer';
			} else {
				this.map.getViewport().style.cursor = 'inherit';
			}
		});
	}

	ngAfterViewInit(): void {
		const overlay = new Overlay({
			element: this.popupMain.nativeElement,
			autoPan: {
				animation: {
					duration: 250,
				},
			},
			offset: [-50, -115],
		});

		this.map.addOverlay(overlay);
	}

	getFeatureCoords(feature: Feature, rawCoords: Coordinate): [Coordinate, string] {
		const featureCoords = feature.getGeometry()?.getClosestPoint(rawCoords) || [0, 0];
		const hdms = toStringXY(toLonLat(featureCoords).reverse(), 5);
		return [featureCoords, hdms];
	}

	closePopup(): boolean {
		let overlay = this.map.getOverlays().getArray();
		overlay[0].setPosition(undefined);
		this.popupCloser.nativeElement.blur();
		return false;
	}
}
