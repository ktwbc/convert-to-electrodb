# convert-to-electrodb
Converter for ORM model files to ElectroDB Model files

Current supports:
* dynamo-types https://www.npmjs.com/package/dynamo-types
* others coming soon or make PR

## Directions

* Place your existing ORM files into the /files/input folder. These can be .ts or .js (note currently only .ts Dynamo-Types files are supported, PRs welcome for other file types)
* yarn install
* yarn run-conversion

Files are written to /files/output folder (created if it does not exist). There is also a generic ddb-client.ts using aws-sdk v3 that is included in the folder which model files reference.

Reference example templates under tests to see the format that the exporter expects. If you get failures, you may need to tweak your own input files to clean up so they convert better.