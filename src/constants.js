import { fromLonLat } from 'ol/proj'
export const wgs84 = "EPSG:4326";
export const wm = "EPSG:3857";

export const myGeoServer = "https://geoserver.wildsong.biz/geoserver";
export const workspace = "clatsop";
export const astoria_ll = [-123.834,46.187];
export const astoria_wm = fromLonLat(astoria_ll);

// Limits for Clatsop County
export const MINZOOM =  8   // entire county will be visible at this level
export const MAXZOOM = 20
export const XMIN = -124.2
export const YMIN =  45.75
export const XMAX = -123.3
export const YMAX =  46.3
export const DEFAULT_CENTER = [ XMIN + (XMAX-XMIN)/2, YMIN + (YMAX-YMIN)/2 ]

export const usngPrecision = [
// dec   zoom
    0, // 0
    0, // 1
    0, // 2
    1, // 3
    1, // 4
    2, // 5
    2, // 6
    2, // 7
    2, // 8
    2, // 9
    3, // 10
    3, // 11
    3, // 12
    3, // 13
    4, // 14
    4, // 15
    4, // 16
    5, // 17
    5, // 18
    6, // 19
    6, // 20
];
