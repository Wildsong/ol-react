// These are constants for use in the Clatsop county area.
import {fromLonLat} from 'ol/proj'

export const myGeoServer = "https://geoserver.wildsong.biz/geoserver";
export const myArcGISServer = "https://delta.co.clatsop.or.us/server/rest/services";

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
export const EXTENT = [XMIN,YMIN, XMAX,YMAX]
export const MAXRESOLUTION = 10

const BOOKMARKS = {
    "Astoria" :          { pos: astoria_wm, zoom: 13, permanent:true},
    "Cannon Beach" :     { pos: fromLonLat([-123.969,45.893]),   zoom: 13, permanent:true},
    "Gearhart" :         { pos: fromLonLat([-123.9188,46.026]),  zoom: 13, permanent:true},
    "Hammond" :          { pos: fromLonLat([-123.9520,46.2000]), zoom: 14, permanent:true},
    "Jewell" :           { pos: fromLonLat([-123.5032,45.9345]), zoom: 14, permanent:true},
    "Neahkahnie Beach" : { pos: fromLonLat([-123.9407,45.7297]), zoom: 13, permanent:true},
    "Seaside" :          { pos: fromLonLat([-123.920,45.994]),   zoom: 12, permanent:true},
    "Warrenton" :        { pos: fromLonLat([-123.924,46.165]),   zoom: 13, permanent:true},
    "Westport" :         {pos: [-13734105.721610297, 5801408.4432601975], zoom: 15, permanent: true},
}
// I added Westport by adding it in the GUI and then copy/paste from debugger
