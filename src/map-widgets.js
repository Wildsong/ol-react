import {Zoom as olZoomControl} from 'ol/control'
import {DragPan as olDragPan, MouseWheelZoom as olMouseWheelZoom} from 'ol/interaction'

export const defaultControls = [
    new olZoomControl()
];

export const defaultInteractions = [
    new olDragPan(),
    new olMouseWheelZoom()
];
