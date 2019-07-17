import {Zoom as olZoomControl} from 'ol/control'
import {DragPan as olDragPan, MouseWheelZoom as olMouseWheelZoom} from 'ol/interaction'

export const defaultControls = [
    new olZoomControl()
];

/* Here are the defaults if interactions is not defined )
0: DragRotate
1: DoubleClickZoom
2: DragPan
3: PinchRotate
4: PinchZoom
5: KeyboardPan
6: KeyboardZoom
7: MouseWheelZoom
8: DragZoom
*/

export const defaultInteractions = [
    //new olDragPan(),
    //new olMouseWheelZoom()
];
