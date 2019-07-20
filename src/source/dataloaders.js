import { EsriJSON, GeoJSON } from 'ol/format'
// import { WKT } from 'ol/format' // I suppose this is theoretically a way to read PostGIS data?
// import { TopoJSON } from 'ol/format'  // Topology JSON supports Microsoft PowerBI
import jsonp from 'jsonp' // jsonp avoids CORS problems

//import { Projection, transformExtent } from 'ol/proj'
//import { wgs84, wm } from '../utils'

export const DataLoader = (loader, url, source) => {
    // Returns a function that can be called to load data.

    console.log('DataLoader()', loader, url, " source=",source)

    switch (loader) {
        case 'geojson':
            let geojsonFormat = new GeoJSON();
            return (extent, resolution, projection) => {
                console.log("geojson dataloader url=", url);
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

// Using application/json or application/javascript here instead of text/2Fjavascript
// results in CrossOrigin errors.
                let bb = ""
                if (!(isNaN(extent[0]) || isNaN(extent[1]) || isNaN(extent[2]) || isNaN(extent[3])))
                    bb = "&BBOX=" + extent.join(',').toString()  // BBOX SRS optional + ',EPSG:3857'
                let fsurl = url + "&outputFormat=text/javascript"
                    //+ "&count=1000" // count appears to do nothing
                    + bb + '&SRSNAME=EPSG:3857'
                jsonp(fsurl, {name:"parseResponse", timeout:60000},
                    (err, data) => {
                        if (err) {
                            console.log("DataLoader", fsurl, err);
                        } else {
                            console.log("DataLoader:", fsurl)
                            let features = geojsonFormat.readFeatures(data, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                console.log("DataLoader features", features.length);
                                source.addFeatures(features);
                            }
                        }
                    }
                );
            }
            break;

        case 'esrijson':
            let esrijsonFormat = new EsriJSON();
/*
This is the full URL captured from the debbugger. I think some fields are probably defaults,
so far what I have enabled below seems to work at least for ArcGIS Online.
https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Oregon_Zoning_2017/FeatureServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666996%2C%22ymax%22%3A6261721.357122989%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&returnCentroid=false&returnExceededLimitFeatures=false&maxRecordCountFactor=3&outSR=102100&resultType=tile&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1222.992452562501%2C%22extent%22%3A%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666994%2C%22ymax%22%3A6261721.35712299%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D
https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Taxlots/FeatureServer/1/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-13786331.473719545%2C%22ymin%22%3A5809530.407877925%2C%22xmax%22%3A-13783942.816585634%2C%22ymax%22%3A5811202.467871663%7D&callback=__jp0
*/
// https://developers.arcgis.com/rest/services-reference/feature-service.htm#GUID-173F40CB-5EBE-4450-B7C8-AC104A8B18F7

            const format = 'json' // Options are: { html | json | pbf | GeoJson }
            return (extent, resolution, projection) => {
                let fsurl = url + '/query/?='
                    + 'f=' + format
                    + '&maxRecordCount=1000'
                    + '&returnGeometry=true&spatialRel=esriSpatialRelIntersects'
                    + '&geometry=' + encodeURIComponent(
                                  '{"xmin":' + extent[0] + ','
                                 + '"ymin":' + extent[1] + ','
                                 + '"xmax":' + extent[2] + ','
                                 + '"ymax":' + extent[3] + '}'
                        )
                    + '&outFields=*' // Specify what attributes are included in results. A comma delimited list would be better here
                    + '&returnCentroid=false'
                    + '&geometryType=esriGeometryEnvelope' // I wonder what this one does?
                    //+ '&inSR=102100'
                    + '&resultType=tile'; // I think maybe this is a good idea? Hard to tell, the server is just slow. :-)

                console.log("esrijson dataloader url=", fsurl);
                jsonp(fsurl, null, (err, data) => {
                    if (err) {
                        console.error("DataLoader() error:", err);
                    } else {
                        console.log("DataLoader() response", data)
                        let features = esrijsonFormat.readFeatures(data, {
                            featureProjection: projection
                        });
                        if (features.length > 0) {
                            console.log("DataLoader(", loader, " ) Adding ", features.length);
                            source.addFeatures(features);
                        }
                    }
                });
            }
            break;

        default:
            throw('Dataloader(): Unknown format:', loader);
            break;
    }
}
