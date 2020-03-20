import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

var map = new Map({
  target: 'map',
  view: new View({
    center: [-13747957,5780349],
    zoom: 11
  }),
  layers: [new VectorTileLayer({
    source: new VectorTileSource({
      format: new MVT(),
      url: 'https://delta.co.clatsop.or.us/server/rest/services/Hosted/Taxlots_vector/VectorTileServer/tile/{z}/{y}/{x}.pbf'
//      url: 'https://delta.co.clatsop.or.us/server/rest/services/Hosted/CC_basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf'
      //url: 'https://delta.co.clatsop.or.us/server/rest/services/Hosted/Clatsop_County_labels/VectorTileServer/tile/{z}/{y}/{x}.pbf'
//      url: 'https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    })
  })]
});

map.on('pointermove', showInfo);

var info = document.getElementById('info');
function showInfo(event) {
  var features = map.getFeaturesAtPixel(event.pixel);
  if (features.length == 0) {
    info.innerText = '';
    info.style.opacity = 0;
    return;
  }
  var properties = features[0].getProperties();
  info.innerText = JSON.stringify(properties, null, 2);
  info.style.opacity = 1;
}
