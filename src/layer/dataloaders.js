import { EsriJSON } from 'ol/format'
import { GeoJSON } from 'ol/format'

// axios does not support jsonp, so can't use it for esri
// jsonp avoids CORS problems so we use it for WFS
import jsonp from 'jsonp'

import { Projection, transformExtent } from 'ol/proj'
import { wgs84, wm } from '../utils'

export const DataLoader = (sourceType, url, source, style) => {
    console.log('DataLoader()', sourceType, url, source)

    switch (sourceType) {
        case 'geojson':
            let geojsonFormat = new GeoJSON();
            return (extent, resolution, projection) => {

                // Reproject from Web Mercator to OR North
                let orNorth = new Projection("EPSG:2913");
                let p = transformExtent(extent, wm, orNorth)

                let fsurl = url +
                "&outputFormat=text%2Fjavascript"
                + '&' + encodeURIComponent('bbox=' + p[0] + ',' + p[1]
                                             + ',' + p[2] + ',' + p[3])
                jsonp(fsurl,
                    { name:"parseResponse", timeout:60000 },
                    (err, data) => {
                        if (err) {
                            console.log("DataLoader():", err);
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
                //console.log("esriLoader_", fsurl, extent, resolution, projection);
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
