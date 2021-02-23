This code started out as richardhills/ol-react for ol3
and brian32768 rewrote it for ol6

This version is written for OpenLayers 6.

There is a version of the code running [HERE](https://delta.co.clatsop.or.us/maps/) right now.
I don't know how many of the services I used are firewalled, I need to look at that!
But you should be able to see maps, some layers will not be available, that's all.

I have to figure out how to deploy the api keys for Mapbox and Bing etc without revealing them in this repo.

## Overview
This is a wrapper for [OpenLayers](http://openlayers.org/) in [React](https://reactjs.org/).

The goal is to be able to write applications using OpenLayers maps in a declarative way. For example, the following is JSX, which can be returned by the render() method on a React component,
to generate a map with a square near the equator.

```JSX
  <MapProvider map={theMap}>
    <Map>
        <CollectionProvider collection={mapLayers}>
          <layer.Tile>
            <source.OSM />
          </layer.Tile>
          <layer.Vector>
            <source.Vector>
              <Feature>
                <geom.LineString>
                  {[[0, 0], [100000, 0], [100000, 100000], [0, 100000]]}
                </geom.LineString>
              </Feature>
            </source.Vector>
          </layer.Vector>
        </CollectionProvider>
    </Map>
  </MapProvider>
```

To understand what each element does, read the [OpenLayers API documentation](http://openlayers.org/en/latest/apidoc/).

I experimented for months with making the source a property of the layer component and just
went back! So I don't even have to change this documentation!

### Other similar projects

Someone sent me a link to [allenhkim/react-openlayers](https://github.com/allenhwkim/react-openlayers), which looks good too. If you know of others let me know.

## Trying it out

The examples at this point rely pretty heavily on data that I host for my own development.
They will still run but there will be layers missing.

Note that OL6 wants you to install pbf, pixelworks, and rbush yourself (via npm).

## Run!

The project uses yarn and the parcel bundler. You need to install yarn and then
install parcel globally. (``yarn add parcel -g``) Once you have done that, use
"yarn start" to launch node and open a brower on http://localhost:1234/

### Styles

The original richardhills version of ol-react had a way to generate styles in JSX notation
but I decided that it's not worth writing and maintaining extra wrapper code,
so currently I write the styles using JavaScript
and pass an OpenLayers Style object in to ol-react.
It takes about the same amount of code either way.

See examples/example1.js for more code.

#### The current version

Write the JavaScript to generate an OpenLayers Style object then pass the object to a Feature component.

JavaScript style declaration

```JavaScript
import {Style, Circle, Fill, Stroke} from 'ol/style'
const cStyle = new Style(
    new Circle({ radius: 10,
        fill: new Fill({color: rgba(100,100,100,0.5)}),
        stroke: new Stroke({color: "green"})
    }))
```

JSX snippet using the style

```JSX
    <Feature id="C2" style={cStyle}>
        <geom.Circle transform={ transformfn } >{[6000,0]}</geom.Circle>
    </Feature>
```

#### Styles the OLD way

This does not work anymore, I am leaving it here in case I resurrect it next week. :-)

Styles used to be declared using a JSON object, passing through the properties you'd like on the final object. For example, when creating a Circle, a `type` parameter must be present,
with the value of `circle`. Like this:

```CSS
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
* THUNDERFOREST_KEY (used in exampl5)

I keep my keys in a file called ".env".
The file looks like this (with real keys, of course):

```bash
MAPBOX_KEY="N0SeynB28iOx7U04i7OTz0xPqqgCU3vOs0tcLwws5"
BINGMAPS_KEY="SeynB28iOx7U04i7OTz0xPqqgCU3vOs0tcLww"
THUNDERFOREST_KEY="89ausduhasd898asduyuhadha0s9djd"
```

## Project status

### Testing

I just ran across this article on testing that is very useful. Partly because of testing :-)
and partly because it shows me how to solve some little React problems in ways I have not
seen before.

https://medium.com/@compatt84/how-to-test-open-layers-react-components-with-mocha-part-i-9a2ca0458ba1

## How to test and develop

I use Visual Studio Code, so I have a .vscode/launch.json file set up.
First in a shell window start the app running "yarn start".
Then you can launch the debug session in VSCode with F5.
Official instructions are here: https://parceljs.org/debugging.html

### Test

The command `yarn start` will launch the demo setup in a browser. Currently that is where I do my testing.

### Build a package and test it

Do this before sending a new version of the package up to npmjs.com.
It will build the package and then run a simple app that uses the package.
I need to learn how to do real tests...

```bash
npm run build-package
npm run test
```

### How I publish to npmjs.com

This will publish the contents of the src/ folder as a new release.
To install it for use in your own project, use "yarn add @map46/ol-react".

```bash
# Save all changes to github
git commit -a
git push
# Move to master branch
git checkout master
# Merge changes from development branch
git merge dev
git commit -a
git push
```

I had to wrestle for an hour before finding I had to do this to make "yarn version" work.

```bash
eval $(ssh-agent -s) && ssh-add ~/.ssh/id_rsa_github_bwilsoncc
```

or at home,

```bash
eval $(ssh-agent -s) && ssh-add ~/.ssh/id_rsa_github
```

Get the current version number from package.json.
Insert it for "NEWVERSION".

```bash
yarn login
tasks/publish.sh NEWVERSION
```

Do NOT run "yarn publish" yourself in the top level folder. It will publish too much!
The publish script will build and publish for you.

This should end up with "master" checked out unless something fails.

### Deploy

Install in your project with ````yarn add @map46/ol-react````.

## The cry for help

If you're familiar with React and/or OpenLayers and are interested in helping, please get in touch.

The original OL3 version available on [github](https://github.com/richardhills/ol-react) and [npm](https://www.npmjs.com/package/ol-react).
my fork at [github](https://github.com/wildsong/ol-react)

Richard says he is "especially interested in assistance with having each component be optionally [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). This would allow binding of the components with, say, Redux and for sophisticated state management outside of OpenLayers."

Brian says "Every day is like Monday to me at this stage."
