import { actions } from './action-types'
import { XMIN,YMIN, XMAX,YMAX, MINZOOM,MAXZOOM } from '../constants'

// center is an array of lon,lat numbers
// zoom is a number
export function setMapCenter(center, zoom) {
    if (zoom < MINZOOM || zoom > MAXZOOM) {
        throw("Zoom outside limits");
    }
    if (center[0] < XMIN || center[0] > XMAX
     || center[1] < YMIN || center[1] > YMAX) {
        throw("Center outside bounding box")
    }
    return {
        type: actions.SETMAPCENTER,
        payload: {
            center,
            zoom
        }
    }
}
