const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const buildDir = path.resolve(__dirname, '../build/@map46/ol-react');

// update the version number in the built version
const versionPath = buildDir + '/version.js';
const versionRegEx = /var VERSION = '(.*)';/g;
const versionSrc = fs.readFileSync(versionPath, 'utf-8').replace(versionRegEx, `var VERSION = '${pkg.version}';`);
fs.writeFileSync(versionPath, versionSrc, 'utf-8');

// Strip out irrelevant sections from package.json
delete pkg.main;
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.style;
delete pkg.eslintConfig;
delete pkg.private;
fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');
