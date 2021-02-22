#!/bin/bash

#
# Run this script to publish a new version of the library to npm.  This requires
# that you have a clean working directory and have created a tag that matches
# the version number in package.json.
#
set -o errexit

#
# Where the unpublished-but-prepped package is living.
#
BUILT_PACKAGE=build/@map46/ol-react

#
# URL for canonical repo.
#
REMOTE=git@github.com:Wildsong/ol-react.git

#
# Build the package and publish.
#
root=$(cd -P -- "$(dirname -- "${0}")" && pwd -P)/..
cd ${root}

# Exit if the current working tree is not clean.
source `git --exec-path`/git-sh-setup && \
require_clean_work_tree "publish" "Please commit or stash them."

yarn version --new-version ${1}
git checkout ${1}

yarn install
yarn run build-package

cd ${BUILT_PACKAGE}
sed -i 's#../openlayers-6#../../../../openlayers-6#' package.json

yarn publish


