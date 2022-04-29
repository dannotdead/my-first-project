import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from 'ol/Map';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  // private map = document.getElementById('ol-map')
  // @ViewChild('olMap') map!: Map


  ngOnInit() {
  }

  allFeatureDelete(): void {
    // let layers = this.map.getLayers().getArray()
    // this.map.removeLayer(layers[1])
  }

}
