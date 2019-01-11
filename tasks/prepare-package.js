const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const buildDir = path.resolve(__dirname, '../build/@map46/ol-react');

// update the version number in version.js
const utilPath = path.join(buildDir, 'version.js');
const versionRegEx = /var VERSION = '(.*)';/g;
const utilSrc = fs.readFileSync(utilPath, 'utf-8').replace(versionRegEx, `var VERSION = '${pkg.version}';`);
fs.writeFileSync(utilPath, utilSrc, 'utf-8');

// Strip out irrelevant sections from package.json
delete pkg.main;
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.style;
delete pkg.eslintConfig;
delete pkg.private;
fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');
