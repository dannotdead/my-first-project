import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Stroke, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { defaults } from 'ol/control';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
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

	private featurePoint: Feature<Point> = new Feature({
		geometry: new Point([]),
	});

	private featurLineString: Feature<LineString> = new Feature({
		geometry: new LineString([]),
	});

	private source = new VectorSource({});

	private pointStyle = new Style({
		image: new Icon({
			crossOrigin: 'anonymous',
			src: 'assets/icon-location30.png',
		}),
	});

	private lineStyle = new Style({
		stroke: new Stroke({
			width: 2,
			color: '#ff0000',
		}),
	});

	private vectorLayer = new VectorLayer({
		source: this.source,
		style: [this.pointStyle, this.lineStyle],
	});

	private pointer = new PointerInteraction({
		handleEvent: (event) => {
			switch (event.type) {
				case 'singleclick':
					const coordinate = event.coordinate;
					const feature = this.map.getFeaturesAtPixel(event.pixel)[0];

					if (feature) {
						const featureCoords = this.featurePoint.getGeometry()?.getCoordinates() || [];
						const overlays = this.map.getOverlays().getArray();

						this.popupContent.nativeElement.innerHTML = `<p>You clicked here (lon, lat):</p><code>${toLonLat(
							featureCoords
						)}</code>`;
						overlays[0].setPosition(this.featurePoint.getGeometry()?.getCoordinates());
					} else {
						this.featurePoint.getGeometry()?.setCoordinates(coordinate);

						const coords = localStorage.getItem(this.coordsItem) || '[]';
						const featureCoords = this.featurePoint.getGeometry()?.getCoordinates() || [];
						this.apiControl.setData(toLonLat(featureCoords).reverse());
						const newCoords = [...JSON.parse(coords), toLonLat(featureCoords)];
						localStorage.setItem(this.coordsItem, JSON.stringify(newCoords));
						this.closePopup();
					}
					break;
				case 'pointermove':
					if (this.map.hasFeatureAtPixel(event.pixel)) {
						this.map.getViewport().style.cursor = 'pointer';
					} else {
						this.map.getViewport().style.cursor = 'inherit';
					}
					break;
			}
			return true;
		},
	});

	ngOnInit(): void {
		localStorage.setItem(this.coordsItem, JSON.stringify([]));
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

		this.map.addInteraction(this.pointer);
		this.source.addFeatures([this.featurePoint, this.featurLineString]);

		this.mapControl.map = this.map;
		this.mapControl.source = this.source;
		this.mapControl.featurePoint = this.featurePoint;
		this.mapControl.featureLineString = this.featurLineString;
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

	closePopup(): boolean {
		let overlay = this.map.getOverlays().getArray();
		overlay[0].setPosition(undefined);
		this.popupCloser.nativeElement.blur();
		return false;
	}
}
