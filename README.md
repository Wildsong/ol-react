This code started out as richardhills/ol-react for ol3
and brian32768 forked it and adapted it for ol5

## Overview

A thin wrapper for [OpenLayers5](http://openlayers.org/) in [React](https://reactjs.org/).

The goal is to be able to write applications using OpenLayers maps in a declarative way. For example, the following is JSX, which can be returned by the render() method on a React component, to generate a map with a red square near the equator.

    <Map view=<View resolution={10000} center={[0, 0]}/>>
      <layer.Tile>
        <source.OSM />
      </layer.Tile>
      <layer.Vector>
        <source.Vector>
          <Feature style={{stroke: {color: [255, 0, 0, 1]}}}>
            <geom.LineString>
              {[[0, 0], [100000, 0], [100000, 100000], [0, 100000]]}
            </geom.LineString>
          </Feature>
        </source.Vector>
      </layer.Vector>
    </Map>

To understand what each element does, read the [OpenLayers API documentation](http://openlayers.org/en/latest/apidoc/).

### Styles

Styles are declared using a JSON object, passing through the properties you'd like on the final object.
When creating an Icon, Circle or RegularShape, a `type` parameter must be present, with the value of `icon`, `circle`, or `regular-shape`.

Example: (See App.js)
```
image: {
    type: 'circle',
    radius: 10,
    fill: { color: [100,100,100, 0.5] },
    stroke: { color: 'green', width: 1 }
}
```

## Project status

### Tested and working in the sample app:
* Controls
 * FullScreen
 * Rotate (actually "set rotation to 0")
 * Zoom slider
* Sources
 * OSM
 * Tile ArcGISRest
 * XYZ tiles
* Layers
 * Tile
 * Vector
* Feature
* Geometry
 * Circle
 * LineString
 * MultiPoint
 * Point
 * Polygon
* Map
* View
* Style (needs more tests)
 * Atlas ?? not yet, not sure what it is anyway
 * Circle
 * Fill
 * Icon - untested
 * Image - untested
 * RegularShape
 * Stroke
 * Style - maybe I can attach a function with this?
 * Text - untested
 * TextPlacement - not yet

#### Work in progress / untested
* Controls
 * Attribution - not hiding the attributions in basemap layer
 * Mouse position - works; need to show how to do formatting
 * Overview map - works; needs more testing
 * Scale line - works, needs styling in example
 * Zoom to extent
 * Zoom
* Interactions
* Sources
 * BingMaps
 * Tile WMS
* Geometry
 * Point and MultiPoint animation
 * Polygons
* Overlay - not sure what this even is right now

## How to test and develop

### Test
The command `npm start` will launch the test setup in a browser.

I added --no-autoinstall option in package.json to prevent parcel from installing openlayers 4 while I am upgrading the source to ol5. This means (for now anyway) you need to run `npm install` before `npm start` to get the dependencies installed.

### Update git

When I do significant changes I bump the patch version number or possibly the minor version

If the current version in package.json is 0.1.9 then
````npm version patch```` would bump the third digit (eg 0.1.10)
and
````npm version minor```` would bump the second digit (eg 0.2.0)
and in either case, it's all pushed up to github.

The command fails if changes are left uncommitted, so 'git commit' first.

### Deploy

The original version can be installed in your project with ````npm install ol-react````.
I haven't gotten past testing yet so I don't have a plan for deployment yet.


## The cry for help

It's early days! If you're familiar with React and/or OpenLayers and are interested in helping, please get in touch.

The original OL3 version available on [github](https://github.com/richardhills/ol-react) and [npm](https://www.npmjs.com/package/ol-react).
Brian's fork for OL5 at [github](https://github.com/brian32768/ol-react)

Richard says he is "especially interested in assistance with having each component be optionally [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). This would allow binding of the components with, say, Redux and for sophisticated state management outside of OpenLayers."

Brian says "This means nothing to me today, maybe tomorrow? :-) Every day is like Monday to me at this stage."
