import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {DragAndDrop, DragAndDropEvent} from 'ol/interaction'
import {Cluster} from 'ol/source'
import {Vector as VectorSource} from 'ol/source/vector'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import OLInteraction from './ol-interaction'
import {LayerContext} from '../layer-context'

class OLDragAndDrop extends OLInteraction {
    static contextType = LayerContext;
    static propTypes = {
    	...OLInteraction.propTypes,
    	source: PropTypes.instanceOf(VectorSource),
    	projection: PropTypes.string,
    //	target: PropTypes.HTMLElement, // element where you can drop things, this does not work
    };

    createInteraction() {
        console.log("OLDragAndDrop.createInteraction", this.props);
        const interaction = new DragAndDrop({
    	    formatConstructors: [
                    GPX,
                    KML,
                    EsriJSON,
                    GeoJSON
    	    ]
        });

        /* this approach fails without throwing any errors
           interaction.addEventListener(DragAndDropEvent,
           (evt) => {
           console.log("OLDragAndDrop.event=", evt);
           }
           );

           I was under the impression that the "on" method was deprecated
           It does not appear to be documented except in Examples.
        */
        let source = this.context.layer.getSource()
        if (source instanceof Cluster) {
            source = source.source;
        }
        interaction.on("addfeatures", (evt) => {
    	    console.log("OLDragAndDrop.addfeatures", evt.features.length, source)
    	    source.addFeatures(evt.features);

    	    // FIXME: This should probably be an option
    	    // Zoom to extent of data
    	    let map = interaction.getMap();
    	    map.getView().fit(source.getExtent());
        });
        return interaction
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDragAndDrop);
