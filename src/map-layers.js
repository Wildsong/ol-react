import {Tile} from 'ol/layer'
import {OSM, Stamen} from 'ol/source'

export const defaultMapLayers = [
    new Tile({source: new OSM()})
]

export const defaultOverviewLayers = [
    new Tile({source: new Stamen({layer:"watercolor"}), opacity:1.0}),
    new Tile({source: new Stamen({layer:"toner"}), opacity:0.6}),
]
