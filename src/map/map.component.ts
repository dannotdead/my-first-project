import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {defaults} from 'ol/control';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
    @ViewChild('popupContent') popupContent!: ElementRef;
    @ViewChild('popupMain') popupMain!: ElementRef;
    @ViewChild('popupCloser') popupCloser!: ElementRef;

    private map!: Map;

    newFeature(coords: Array<number>): Feature {
      return new Feature({
        geometry: new Point(coords)
      })
    }

    private feauture = new Feature({
      geometry: new Point([])
    })

    private source = new VectorSource({
      features: [this.feauture]
    });

    private style = new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        src: 'assets/icon-location30.png',
      })
    })

    private modify = new Modify({
      source: this.source,
      style: this.style
    });

    private draw = new Draw({
      source: this.source,
      type: 'Point',
    });

    ngOnInit(): void {
      this.map = new Map({
        view: new View({
          center: [0, 0],
          zoom: 1,
        }),
        controls: defaults({
          attribution : false,
          zoom : false,
          rotate: false
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: this.source,
            style: this.style
          })
        ],
        target: 'ol-map'
      });

      this.map.on('singleclick', (event) => {
        this.map.addInteraction(this.modify);
        this.map.addInteraction(this.draw);

        const coordinate = event.coordinate
        const hdms = toStringHDMS(toLonLat(coordinate));
        this.popupContent.nativeElement.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;

        let overlay = new Overlay({
          element: this.popupMain.nativeElement,
          autoPan: {
            animation: {
              duration: 250,
            },
          },
          offset: [-50, -115]
        });
        overlay.setPosition(coordinate);
        this.map.addOverlay(overlay);
        this.source.addFeature(this.newFeature(coordinate));
      })
    }

    closePopup(): boolean {
      let overlay = this.map.getOverlays().getArray()
      overlay[overlay.length - 1].setPosition(undefined)
      this.popupCloser.nativeElement.blur();
      return false;
    }
}
