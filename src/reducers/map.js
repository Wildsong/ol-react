import { actions } from '../actions'
import {Map, View} from 'ol';
import { toLonLat, fromLonLat } from 'ol/proj'
import { DEFAULT_CENTER,MINZOOM } from '../constants'

const olMap = new Map({
    view: new View({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM }),
    // in this version you must explicitly add any controls or Interactions
    controls: [], interactions: [],
})

const initialState = {
    // The map will be in projected coords, usually web mercator.
    theMap: olMap,

    // These are stored in WGS84, always.
    center: DEFAULT_CENTER,
    zoom: MINZOOM
}

export const map = (state=initialState, action={}) => {
    let newState;
    switch(action.type) {
        case actions.SETMAPCENTER:
            newState = {
                ...state,
                ...action.payload,
            }
            break;
        default:
        console.log("ol-react map reducer:", action.type, " (state not changed)", state);
            return state;
    }
    console.log("ol-react map reducer:", action.type, state, " =>", newState);
    return newState;
}
