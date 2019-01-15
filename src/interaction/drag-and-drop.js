import {DragAndDrop} from 'ol/interaction';
import OLInteraction from './ol-interaction';

export default class OLDragAndDrop extends OLInteraction {
    createInteraction(props) {
        console.log("OLDragAndDrop.createInteraction()", props);
        let interaction = new DragAndDrop();
        interaction.addEventListener("DragAndDropEvent",
            (evt) => {
                console.log("OLDragAndDrop.event=", evt);
            }
        );
        return interaction
    }
}

// FIXME this needs attention obviously
//OLDragAndDrop.propTypes = Object.assign({}, OLInteraction.propTypes, {
//    source: VectorSource,
//    projection: PropTypes.string,
//    target: PropTypes.HTMLElement, // element where you can drop things
//})
