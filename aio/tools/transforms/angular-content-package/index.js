/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Package = require('dgeni').Package;
const glob = require('glob');
const ignore = require('ignore');
const fs = require('fs');
const path = require('canonical-path');
const basePackage = require('../angular-base-package');
const contentPackage = require('../content-package');

const { CONTENTS_PATH, GUIDE_EXAMPLES_PATH } = require('../config');

module.exports = new Package('angular-content', [basePackage, contentPackage])

  // Where do we get the source files?
  .config(function(readFilesProcessor, collectExamples) {

    const gitignoreFile = fs.readFileSync(path.resolve(GUIDE_EXAMPLES_PATH, '.gitignore'), 'utf8');
    const gitignore = ignore().add(gitignoreFile);

    const examplePaths = glob.sync('**/*', { cwd: GUIDE_EXAMPLES_PATH, dot: true, ignore: '**/node_modules/**', mark: true })
                            .filter(filePath => filePath !== '.gitignore') // we are not interested in the .gitignore file itself
                            .filter(filePath => !/\/$/.test(filePath)); // this filter removes the folders, leaving only files
    const filteredExamplePaths = gitignore.filter(examplePaths) // filter out files that match the .gitignore rules
                            .map(filePath => path.resolve(GUIDE_EXAMPLES_PATH, filePath)); // we need the full paths for the filereader

    readFilesProcessor.sourceFiles = readFilesProcessor.sourceFiles.concat([
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/{cookbook,guide,tutorial}/**/*.md',
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH + '/marketing',
        include: CONTENTS_PATH + '/marketing/**/*.{html,md}',
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/*.md',
        exclude: [CONTENTS_PATH + '/index.md'],
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: filteredExamplePaths,
        fileReader: 'exampleFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/navigation.json',
        fileReader: 'jsonFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/marketing/contributors.json',
        fileReader: 'jsonFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/marketing/resources.json',
        fileReader: 'jsonFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/translations/**/*.md',
        fileReader: 'contentFileReader'
      },
    ]);

    collectExamples.exampleFolders.push('examples');
  })


  // Configure jsdoc-style tag parsing
  .config(function(inlineTagProcessor) {
    inlineTagProcessor.inlineTagDefinitions.push(require('./inline-tag-defs/anchor'));
  })


  .config(function(computePathsProcessor) {

    // Replace any path templates inherited from other packages
    // (we want full and transparent control)
    computePathsProcessor.pathTemplates = computePathsProcessor.pathTemplates.concat([
      {
        docTypes: ['content'],
        getPath: (doc) => `${doc.id.replace(/\/index$/, '')}`,
        outputPathTemplate: '${path}.json'
      },
      {docTypes: ['navigation-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'},
      {docTypes: ['contributors-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'},
      {docTypes: ['resources-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'}
    ]);
  })

  // We want the content files to be converted
  .config(function(convertToJsonProcessor, postProcessHtml) {
    convertToJsonProcessor.docTypes.push('content');
    postProcessHtml.docTypes.push('content');
  });
