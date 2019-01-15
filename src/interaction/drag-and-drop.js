import { DragAndDrop, DragAndDropEvent } from 'ol/interaction'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import OLInteraction from './ol-interaction'
import { LayerContext } from '../layer-context'

export default class OLDragAndDrop extends OLInteraction {
    createInteraction(props) {
        let source = this.context.layer.getSource()
        console.log("OLDragAndDrop.createInteraction", props);
        let interaction = new DragAndDrop({
            formatConstructors: [
                GPX,
                KML
            ],
            source: source,
//            projection: this.props.projection
        });

        /* well this fails
        interaction.addEventListener(DragAndDropEvent,
            (evt) => {
                console.log("OLDragAndDrop.event=", evt);
            }
        );
        */
        interaction.on("addfeatures", (evt) => {
            console.log("OLDragAndDrop.addfeatures", evt);
            //let source = this.context.layer.getSource()
            //source.addFeatures(evt.features);

            // FIXME: This should probably be optional
            // Zoom to extent of data
            let map = interaction.getMap();
            map.getView().fit(source.getExtent());
        });
        return interaction
    }
}
OLDragAndDrop.contextType = LayerContext

// FIXME this needs attention obviously
//OLDragAndDrop.propTypes = Object.assign({}, OLInteraction.propTypes, {
//    source: VectorSource,
//    projection: PropTypes.string,
//    target: PropTypes.HTMLElement, // element where you can drop things
//})
