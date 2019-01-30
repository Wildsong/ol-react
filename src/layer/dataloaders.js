import { EsriJSON } from 'ol/format'

// Can't use axios here because it does not support jsonp
import jsonp from 'jsonp'

let esrijsonFormat = new EsriJSON();

export const DataLoader = (sourceType, url, source) => {
    //console.log('DataLoader()', sourceType, url, source)

    // So far this is all we know how to do, EsriJSON!

    //console.log("EsriJSON", url);
    return (extent, resolution, projection) => {
        let fsurl = url  + '0' + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(    '{"xmin":' + extent[0] + ',"ymin":' + extent[1]
                                 + ',"xmax":' + extent[2] + ',"ymax":' + extent[3])
                                 + '&geometryType=esriGeometryEnvelope&outFields=*';
        //console.log("esriLoader_", fsurl, extent, resolution, projection);
        jsonp(fsurl, null, (err, data) => {
            if (err) {
                console.log("DataLoader() error:", error);
            } else {
                //console.log("DataLoader() response", data)
                let features = esrijsonFormat.readFeatures(data, {
                    featureProjection: projection
                });
                if (features.length > 0) {
                    console.log("DataLoader() Adding ", features.length);
                    source.addFeatures(features);
                }
            }
        });
    }
}
