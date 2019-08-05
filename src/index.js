export { VERSION } from './version'
import * as control from './control'
import * as geom from './geom'
import * as interaction from './interaction'
import * as layer from './layer'
import * as source from './source'

export {control, geom, interaction, layer, source}

export {default as Feature} from './feature'
export {default as Graticule} from './graticule'
export {default as Map} from './map'
export {default as Overlay} from './overlay'

import React from 'react'
import {VERSION} from 'ol/util'
export const OpenLayersVersion = () => ( <>{VERSION}</> );
