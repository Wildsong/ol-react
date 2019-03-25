import { EsriJSON } from 'ol/format'
import { GeoJSON } from 'ol/format'
// axios does not support jsonp, so can't use it for esri
// jsonp avoids CORS problems so we use it for WFS too
import jsonp from 'jsonp'

//import { Projection, transformExtent } from 'ol/proj'
//import { wgs84, wm } from '../utils'

export const DataLoader = (sourceType, url, source, style) => {
    // Returns a function that can be called to load data.

    //console.log('DataLoader()', sourceType, url, source)

    switch (sourceType) {

        case 'geojson':
            let geojsonFormat = new GeoJSON();
            return (extent, resolution, projection) => {

                // Reproject from Web Mercator to OR North
                //let orNorth = new Projection("EPSG:2913");
                //let p = transformExtent(extent, wm, orNorth)

// This is what a well-formed query from QGIS looks like
//"GET /geoserver/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&
//TYPENAMES=clatsop-wfs:taxlots
//&STARTINDEX=0&COUNT=1000
//&SRSNAME=urn:ogc:def:crs:EPSG::3857
//&BBOX=-13799781.77290469780564308,5763634.00552924070507288,-13799148.80835255607962608,5763990.56951477471739054,urn:ogc:def:crs:EPSG::3857 HTTP/1.1"
// 301 169 "-"
//"Mozilla/5.0 QGIS/3.6.0-Noosa
                let bb = "&BBOX=" + extent.join(',').toString() + ',EPSG:3857'
                let fsurl = url + "&outputFormat=text/javascript" +
                    "&count=5000" + bb + '&SRSNAME=EPSG:3857'
                jsonp(fsurl,
                    { name:"parseResponse", timeout:60000 },
                    (err, data) => {
                        if (err) {
                            console.log("DataLoader(", url, " ):", err);
                        } else {
                            console.log("DataLoader():", data)
                            let features = geojsonFormat.readFeatures(data, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                console.log("DataLoader(", sourceType, " ) Adding ", features.length);
                                features.forEach( (f) => {
                                    f.setStyle(style);
                                })
                                source.addFeatures(features);
                            }
                    }
                });
            }
            break;

        case 'esrijson':
            let esrijsonFormat = new EsriJSON();
            return (extent, resolution, projection) => {
                let fsurl = url  + '0' + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(    '{"xmin":' + extent[0] + ',"ymin":' + extent[1]
                                         + ',"xmax":' + extent[2] + ',"ymax":' + extent[3])
                                         + '&geometryType=esriGeometryEnvelope&outFields=*';
                jsonp(fsurl, null, (err, data) => {
                    if (err) {
                        console.log("DataLoader() error:", err);
                    } else {
                        //console.log("DataLoader() response", data)
                        let features = esrijsonFormat.readFeatures(data, {
                            featureProjection: projection
                        });
                        if (features.length > 0) {
                            console.log("DataLoader(", sourceType, " ) Adding ", features.length);
                            source.addFeatures(features);
                        }
                    }
                });
            }
            break;
        default:
            throw 'Unknown sourceType, "' + sourceType;
    }
}
