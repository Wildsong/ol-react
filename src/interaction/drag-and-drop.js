import { DragAndDrop, DragAndDropEvent } from 'ol/interaction'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import OLInteraction from './ol-interaction'
import { LayerContext } from '../layer-context'

export default class OLDragAndDrop extends OLInteraction {
    static contextType = LayerContext
    // FIXME this needs attention obviously
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
//    source: VectorSource,
//    projection: PropTypes.string,
//    target: PropTypes.HTMLElement, // element where you can drop things
    })

    createInteraction(props) {
        let source = this.context.layer.getSource()
        console.log("OLDragAndDrop.createInteraction", props);
        let interaction = new DragAndDrop({

	    // FIXME This should be a prop and default
	    formatConstructors: [
                GPX,
                KML,
                EsriJSON,
                GeoJSON
	    ],
	    source: source,
	    //            projection: this.props.projection
        });

        /* this fails without throwing any errors
           interaction.addEventListener(DragAndDropEvent,
           (evt) => {
           console.log("OLDragAndDrop.event=", evt);
           }
           );

           I was under the impression that the on method was deprecated
           This does not appear to be documented except in Examples.
        */
        interaction.on("addfeatures", (evt) => {
	    console.log("OLDragAndDrop.addfeatures", evt, evt.features.length, " features.")
	    // This just generates an error saying you already added the features
	    //let source = this.context.layer.getSource()
	    //source.addFeatures(evt.features);

	    // FIXME: This should probably be an option
	    // Zoom to extent of data
	    let map = interaction.getMap();
	    map.getView().fit(source.getExtent());
        });
        return interaction
    }
}
