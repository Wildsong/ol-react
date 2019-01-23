import {DragPan as olDragPan} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class DragPan extends OLInteraction {
    createInteraction (props) {
	return new olDragPan()
    }
}
