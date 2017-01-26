const blockC = require('./region-matchers/block-c');
const html = require('./region-matchers/html');
const inlineC = require('./region-matchers/inline-c');
const inlineCOnly = require('./region-matchers/inline-c-only');
const inlineHash = require('./region-matchers/inline-hash');
const NO_NAME_REGION = '';
const DEFAULT_PLASTER = '. . .';
const {mapObject} = require('../utils');

module.exports = function regionParser() {
  return regionParserImpl;
};

regionParserImpl.regionMatchers = {
  ts: inlineC,
  js: inlineC,
  es6: inlineC,
  dart: inlineC,
  html: html,
  css: blockC,
  yaml: inlineHash,
  jade: inlineCOnly
};

/**
 * @param contents string
 * @param fileType string
 * @returns {contents: string, regions: {[regionName: string]: string}}
 */
function regionParserImpl(contents, fileType) {
  const regionMatcher = regionParserImpl.regionMatchers[fileType];
  const openRegions = [];
  const regionMap = {};

  if (regionMatcher) {
    let plaster = regionMatcher.createPlasterComment(DEFAULT_PLASTER);
    const lines = contents.split(/\r?\n/).filter((line, index) => {
      const startRegion = line.match(regionMatcher.regionStartMatcher);
      const endRegion = line.match(regionMatcher.regionEndMatcher);
      const updatePlaster = line.match(regionMatcher.plasterMatcher);

      // start region processing
      if (startRegion) {
        // open up the specified region
        const regionName = getRegionName(startRegion[1]);
        const region = regionMap[regionName];
        if (region) {
          if (region.open) {
            throw new RegionParserError(
                `Tried to open a region, named "${regionName}", that is already open`, index);
          }
          region.open = true;
          region.lines.push(plaster);
        } else {
          regionMap[regionName] = {lines: [], open: true};
        }
        openRegions.push(regionName);

        // end region processing
      } else if (endRegion) {
        if (openRegions.length === 0) {
          throw new RegionParserError('Tried to close a region when none are open', index);
        }
        // close down the specified region (or most recent if no name is given)
        const regionName = getRegionName(endRegion[1]) || openRegions[openRegions.length - 1];
        const region = regionMap[regionName];
        if (!region || !region.open) {
          throw new RegionParserError(
              `Tried to close a region, named "${regionName}", that is not open`, index);
        }
        region.open = false;
        removeLast(openRegions, regionName);

        // doc plaster processing
      } else if (updatePlaster) {
        plaster = regionMatcher.createPlasterComment(updatePlaster[1].trim());

        // simple line of content processing
      } else {
        openRegions.forEach(regionName => regionMap[regionName].lines.push(line));
        // do not filter out this line from the content
        return true;
      }

      // this line contained an annotation so let's filter it out
      return false;
    });
    return {
      contents: lines.join('\n'),
      regions: mapObject(regionMap, (regionName, region) => region.lines.join('\n'))
    };
  } else {
    return {contents, regions: {}};
  }
}

function getRegionName(input) {
  return input.trim();
}

function removeLast(array, item) {
  const index = array.lastIndexOf(item);
  array.splice(index, 1);
}

function RegionParserError(message, lineNum) {
  this.message = `regionParser: ${message} (at line ${lineNum}).`;
  this.lineNum = lineNum;
  this.stack = (new Error()).stack;
}
RegionParserError.prototype = Object.create(Error.prototype);
RegionParserError.prototype.constructor = RegionParserError;