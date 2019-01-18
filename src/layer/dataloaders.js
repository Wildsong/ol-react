import { EsriJSON } from 'ol/format'

// THIS IS TEMPORARY!!
// only using ajax not accessing DOM so should be okay for now.
import jquery from 'jquery'

let esrijsonFormat = new EsriJSON();

export const DataLoader = (sourceType, url, source) => {
    console.log('DataLoader()', sourceType, url, source)

    // So far this is all we know how to do, EsriJSON!

    console.log("EsriJSON", url);
    return (extent, resolution, projection) => {
        let fsurl = url  + '0' + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(    '{"xmin":' + extent[0] + ',"ymin":' + extent[1]
                                 + ',"xmax":' + extent[2] + ',"ymax":' + extent[3])
                                 + '&geometryType=esriGeometryEnvelope&outFields=*';
        console.log("esriLoader_", fsurl, extent, resolution, projection);
        jquery.ajax({
            url: fsurl,
            dataType: 'jsonp',
            success: function(response) {
                if (response.error) {
                    console.log(response.error.message + response.error.details + ' IS IT SHARED? I can\'t do auth!');
                } else {
                    let features = esrijsonFormat.readFeatures(response, {
                            featureProjection: projection
                    });
                    console.log("Adding features.", features.length, source);
                    if (features.length > 0) {
                        source.addFeatures(features);
                    }
                }
            }
        });
    }
}
