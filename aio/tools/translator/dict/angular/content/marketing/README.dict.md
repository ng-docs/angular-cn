Contributors page



We have an official accounting of who is on the Angular Team \(see [this link](/about?group=Angular)\), who are "trusted collaborators" \(see [this link](/about?group=Collaborators)\), and so on.



The `contributors.json` should be maintained to keep our "org chart" in a single consistent place.



GDE listings



There are two pages:



https://developers.google.com/experts/all/technology/angular
\(Googlers: source at http://google3/googledata/devsite/content/en/experts/all/technology/angular.html\) which is maintained by Dawid Ostrowski based on a spreadsheet https://docs.google.com/spreadsheets/d/1_Ls2Kle7NxPBIG8f3OEVZ4gJZ8OCTtBxGYwMPb1TUVE/edit#gid=0.



<!-- gkalpak: That URL doesn't seem to work anymore. New URL: https://developers.google.com/programs/experts/directory/ (?) -->



[Ours](/about?group=GDE) which is derived from `contributors.json`.



About the data



Keys in `contributors.json` should be GitHub handles. \(Most currently are, but not all.\)
This will allow us to use GitHub as the default source for things like name, avatar, etc.



Keys are sorted in alphabetical order, please keep the sorting order when adding new entries.



Pictures are stored in `aio/content/images/bios/<picture-filename>`.



Processing the data



Install https://stedolan.github.io/jq/ which is amazing.



Relevant scripts are stored in `aio/scripts/contributors/`.