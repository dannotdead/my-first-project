import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Snap } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {defaults} from 'ol/control';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
    name= '';

    @ViewChild('popupContent') popupContent: ElementRef;

    container = document.getElementById('popup');
    closer = document.getElementById('popup-closer');

    map: Map;

    source = new VectorSource();

    style = new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    });

    overlay = new Overlay({
      element: this.container!,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    modify = new Modify({
      source: this.source,
      style: this.style
    });

    draw = new Draw({
      source: this.source,
      type: 'Point',
    });

    snap = new Snap({source: this.source});

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
        overlays: [this.overlay],
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
    }

    addInteractions(event: any): void {
      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);

      const coordinate = this.map.getEventCoordinate(event)
      const hdms = toStringHDMS(toLonLat(coordinate));
      this.popupContent.nativeElement.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;
      this.overlay.setPosition(coordinate);
    }

    closePopup(): boolean {
      this.overlay.setPosition(undefined);
      this.closer!.blur();
      return false;
    }
}
