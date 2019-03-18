This code started out as richardhills/ol-react for ol3
and brian32768 forked it and adapted it for ol5

It's changed so much now that I am close to declaring it a new project.

## Overview

A wrapper for [OpenLayers5](http://openlayers.org/) in [React](https://reactjs.org/).

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
## API keys

When a map source needs a key you need to put the
key into an environment variable.

* BINGMAPS_KEY (used in example4)
* MAPBOX_KEY (used in example7)

Currently I keep my keys in a file called api_keys.bat and load them in the 'start' script
in package.json. The file looks like this (with real keys, of course):

````bash
rem DON'T check this file into git!
SET MAPBOX_KEY=N0SeynB28iOx7U04i7OTz0xPqqgCU3vOs0tcLwws5
SET BINGMAPS_KEY=SeynB28iOx7U04i7OTz0xPqqgCU3vOs0tcLww
````

## Project status

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

## How to test and develop

### Test
The command `npm start` will launch the test setup in a browser.

I added --no-autoinstall option in package.json to prevent parcel from installing openlayers 4 while I am upgrading the source to ol5. This means (for now anyway) you need to run `npm install` before `npm start` to get the dependencies installed.

### Publishing to npmjs.com

This will publish the contents of the src/ folder as a new release.
To install it for use in your own project, use "npm install @map46/ol-react".


    # Save all changes to github
    git push
    # Move to master branch
    git checkout master
    # Merge changes from development branch
    git merge dev
    git commit -a
    git push

Today I had to wrestle for an hour before finding I had to do this to make "npm version" work.

    eval $(ssh-agent -s) && ssh-add "j:\.ssh\id_rsa_github_bwilsoncc"

I suspect I need to run "npm login" before running the tasks/publish.sh script.

    # Update version in package.json (see below)
    npm version minor
    # or
    npm version patch

    tasks/publish.sh

Do NOT run "npm publish" yourself in the top level folder. It will publish too much!
The publish script will run "npm build-package" and "npm publish" for you.
The script runs 'npm publish' after chdir'ing down into the build folder.

At this point do 'git status' and you will see you're not on a branch.
You need to do a 'git checkout master' to move back onto that branch or 'git checkout dev' to go back to work.

### Update git

When I do significant changes I bump the patch version number or possibly the minor version

The "npm version" command fails if changes are left uncommitted, so 'git commit' first.

If the current version in package.json is 0.1.9 then
````npm version patch```` would bump the third digit (eg 0.1.10)
and
````npm version minor```` would bump the second digit (eg 0.2.0)
and in either case, it's all pushed up to github.

### Deploy

Install in your project with ````npm install ol-react````.

## The cry for help

If you're familiar with React and/or OpenLayers and are interested in helping, please get in touch.

The original OL3 version available on [github](https://github.com/richardhills/ol-react) and [npm](https://www.npmjs.com/package/ol-react).
Brian's fork for OL5 at [github](https://github.com/brian32768/ol-react)

Richard says he is "especially interested in assistance with having each component be optionally [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). This would allow binding of the components with, say, Redux and for sophisticated state management outside of OpenLayers."

Brian says "Okay learning about this now :-) Every day is like Monday to me at this stage."
