Most of this used to be in README.md

2019-07-29
This list needs updating -- every day :-)

### Tested and working in the sample app:
* Controls
 * FullScreen
 * Rotate (actually "set rotation to 0")
 * Zoom slider
* Sources
 * OSM
 * BingMaps -- requires your API key
 * Tile ArcGIS REST and GeoServer WMS
 * Vector tiles (only tested with GeoServer so far, not ArcGIS)
 * XYZ tiles tested with ArcGIS
* Layers
 * Tile
 * Vector (with option for clustered point features)
* Feature
* Geometry
 * Circle
 * LineString
 * MultiPoint
 * Point
 * Polygon
* Graticule
* Interactions
 * double click zoom
 * Mouse position - works; need to show how to do formatting
* Map
* View
* Style (needs more tests)
 * Atlas ?? not yet, not sure what it is anyway
 * Circle
 * Fill
 * Icon - untested
 * Image
 * RegularShape
 * Stroke
 * Style - maybe I can attach a function with this?
 * Text - untested
 * TextPlacement - not yet

#### Work in progress / untested
* Geocoding (in example 5) is under development
* Controls
 * Attribution - not hiding the attributions in basemap layer
 * Overview map - works; needs more testing
 * Scale line - works, needs styling in example
 * Zoom to extent
 * Zoom
* Geometry
 * Point and MultiPoint animation
 * Polygons
* Overlay - not sure what this even is right now

I need to update examples that use servers that are accessible publicly so that my
samples work everywhere. The examples are currently tied to a GeoServer at
maps.wildsong.biz (not public) and cc-gis (also not public).
If you run them you will see generic base maps but the data layers will not load.

In development it's much easier to debug when I can see the log files from the
servers and make changes on the servers as needed.
