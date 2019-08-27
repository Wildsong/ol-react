import {EsriJSON, GeoJSON} from 'ol/format'
// import { WKT } from 'ol/format' // I suppose this is theoretically a way to read PostGIS data?
// import { TopoJSON } from 'ol/format'  // Topology JSON supports Microsoft PowerBI
import jsonp from 'jsonp' // jsonp avoids CORS problems

import proj4 from 'proj4'
import {register} from 'ol/proj/proj4'
import {Projection, transformExtent} from 'ol/proj'
import {WM} from '../constants'

const ORNORTH = "EPSG:2913"
const PROJ4_ORNORTH = "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +to_meter=0.3048 +no_defs"
proj4.defs(ORNORTH, PROJ4_ORNORTH)
register(proj4)
// optionally I can define the extent of ORNORTH here too.
const ornorthproj = new Projection({code: ORNORTH})

const isWM = (code) => {
    return (code === WM)
        || (code === 'EPSG:102100') // Stupid ESRI deprecated code
        || (code === 'EPSG:900913') // Stupid Google deprecated code, to be fair to ESRI
}

export const DataLoader = (loader, url, source) => {
    // Returns a function that can be called to load data.

    console.log('DataLoader()', loader, url, " source=",source)

    switch (loader) {
        case 'geojson':
            return (extent, resolution, projection) => {
                const geojson = new GeoJSON();

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
                if ((isFinite(extent[0]) && isFinite(extent[1]) && isFinite(extent[2]) && isFinite(extent[3])))
                    bb = "&BBOX=" + extent.join(',').toString()   + ',EPSG%3A3857'
                let fsurl = url + "&outputFormat=text/javascript"
                    //+ "&count=1000"
                    + bb + '&SRSNAME=EPSG%3A3857'
                jsonp(fsurl, {name:"parseResponse", timeout:60000},
                    (err, data) => {
                        if (err) {
                            console.log("DataLoader", fsurl, err);
                        } else {
                            console.log("DataLoader:", fsurl)
                            let features = geojson.readFeatures(data, {
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

        case 'esrijson': {
            const esrijson = new EsriJSON();
/*
This is the full URL captured from the debugger. I think some fields are probably defaults,
so far what I have enabled below seems to work at least for ArcGIS Online.
https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Oregon_Zoning_2017/FeatureServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666996%2C%22ymax%22%3A6261721.357122989%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&returnCentroid=false&returnExceededLimitFeatures=false&maxRecordCountFactor=3&outSR=102100&resultType=tile&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1222.992452562501%2C%22extent%22%3A%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666994%2C%22ymax%22%3A6261721.35712299%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D
https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Taxlots/FeatureServer/1/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-13786331.473719545%2C%22ymin%22%3A5809530.407877925%2C%22xmax%22%3A-13783942.816585634%2C%22ymax%22%3A5811202.467871663%7D&callback=__jp0
*/
// https://developers.arcgis.com/rest/services-reference/feature-service.htm#GUID-173F40CB-5EBE-4450-B7C8-AC104A8B18F7
            return (extent, resolution, mapProjection) => {
                const format = 'json' // Options are: { html | json | pbf | geoJson | AMF }
                let sourceBbox = extent;

                // This major PITA brought to you by ESRI, I want to keep the source layers
                // in ArcGIS Enterprise, and I don't want to keep separate reprojected copies in WM
                // so I read them in Oregon North and then reproject on the fly here. So far so good.
                // But the bbox has to be in Oregon North when I do the request.
                // This could all be avoided if ESRI really supported GeoJSON because GeoJSON
                // is ALWAYS in WM. They say they do in the FeatureServer but they just don't.

                // what's my source projection? if I knew I could transform the extent
                jsonp(url + "?f=json", null, (err,data) => {
                    if (err) {
                        console.error("While reading projection there was an epic fail", err);
                    } else {
                        // I had to read the OL source code to figure out how to get this.
                        // I feel this is the wrong approach but it works for now.
                        const sourceProjection = esrijson.readProjection(data.extent);
                        const sourceCode = sourceProjection.getCode()
                        const mapCode = mapProjection.getCode()
                        let srs = ''
                        if ((sourceCode === mapCode) || (isWM(sourceCode) && isWM(mapCode))) {
                            // source and map are the same, don't transform
                            sourceBbox = extent;
                            console.log("esrijson no reprojection needed ", sourceCode, '=>', mapCode);
                        } else {
                            sourceBbox = transformExtent(extent, WM, sourceProjection)
                            console.log("esrijson reprojecting ", sourceCode, '=>', mapCode);
                            // this apparently not needed //srs = '&inSR=' + sourceCode // + '&outSR=' + mapCode
                        }

                        let fsurl = url + '/query/?'
                            + 'f=' + format
                            + '&maxRecordCount=1000'
                            + '&returnGeometry=true'
                            + '&spatialRel=esriSpatialRelIntersects'
                            + '&geometry=' + encodeURIComponent(
                                          '{"xmin":' + sourceBbox[0] + ','
                                         + '"ymin":' + sourceBbox[1] + ','
                                         + '"xmax":' + sourceBbox[2] + ','
                                         + '"ymax":' + sourceBbox[3] + '}'
                                )
                            + '&geometryType=esriGeometryEnvelope' // I wonder what this one does?
                            + '&outFields=*' // Specify what attributes are included in results. A comma delimited list would be better here
                            + '&returnCentroid=false'
                            + srs
                            + '&resultType=tile'; // I think maybe this is a good idea? Hard to tell, the server is just slow. :-)

                        console.log("esrijson dataloader fsurl=", fsurl);
                        jsonp(fsurl, null, (err, data) => {
                            if (err) {
                                console.error("DataLoader() error:", err);
                            } else {
                                console.log("DataLoader() response", data)
                                let features = esrijson.readFeatures(data, {
                                    featureProjection: mapProjection
                                });
                                if (features.length > 0) {
                                    console.log("DataLoader(", loader, " ) Adding ", features.length);
                                    source.addFeatures(features);
                                }
                            }
                        });
                    }
                });
            }
        }

        default:
            throw('Dataloader(): Unknown format:', loader);
    }
}
