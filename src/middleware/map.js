import { actions } from '../actions'
import { router, setMapQuery } from '../reducers'

export const mapMiddleware = store => {
    return next => action => {
        try {
            const state = store.getState()
            //console.log("mapMiddleware action=",action, " state=",state);
            switch (action.type) {
/* I need to implement these.
   Go look at the view.js component which is now dead code.

                case actions.SETROTATION:
                    break;
                case actions.SETMINZOOM:
                    break;
                case actions.SETMAXZOOM:
                    break;
                case actions.SETPROJECTION:
                    break;
*/
                case actions.SETMAPCENTER:
                    // Calling "page" reducer will cause the URL address to update (and push to history).
                    store.dispatch({type:actions.MAP,
                        payload: {
                            query: setMapQuery(action.payload.center, action.payload.zoom)
                        }
                    }, state)

                    // Should this be in the reducer or here???
                    store.map.theMap.view.setCenter(fromLonLat(store.map.center));
                    store.map.theMap.view.setZoom(fromLonLat(store.map.zoom));
                    break;

                default:
                    //console.log('mapMiddleware action', action.type, action);
                    break;
            }
            return next(action)
        } catch(err) {
            console.error('mapMiddleware error', err)
            throw err
        }
    }
}
