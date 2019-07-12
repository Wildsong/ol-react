import { actions } from './action-types'

// center is an array of lon,lat numbers
// zoom is a number
export function setMapCenter(center, zoom) {
    console.log("setMapCenter");
    return {
        type: actions.SETMAPCENTER,
        payload: {
            center,
            zoom
        }
    }
}
