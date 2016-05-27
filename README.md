# BloodFlow

Blood results visualisation from NHS Hackday 13 (May 2016)

## Demo

http://bloodflow.lfrg.uk/

## Getting Started

### Dependencies

Tools required to run this app:

* `node` and `npm`

### Installing

* `clone` this repository
* `npm install -g gulp karma karma-cli webpack` install global cli dependencies
* `npm install` to install dependencies
* Create an `.env` file in the repository root (local proxy and offline examples provided)

### Running

Gulp is used to build and launch the development environment

* `gulp serve` or just `gulp` starts a dev server at http://localhost:3000/
* `gulp proxy` starts a proxy server (for avoiding CORS problems) at http://localhost:4000/
* `gulp webpack` builds the app in `dist/` for static deployment

See the [Angular NG6 Starter](https://github.com/AngularClass/NG6-starter) project for more options  

## Uses

* [D3](https://d3js.org/) Data driven visualisation library
* [Smart-on-FHIR](http://docs.smarthealthit.org/) Open specifications to integrate apps with Electronic Health Records
* [Angular NG6 Starter](https://github.com/AngularClass/NG6-starter) Starter repo for building Angular + ES6 + Webpack apps

## Resources

We are using FHIR DST2 and the list of resources can be found here:

* https://www.hl7.org/fhir/resourcelist.html

Resources of interest are:

* https://www.hl7.org/fhir/observation.html
* https://www.hl7.org/fhir/diagnosticreport.html
* https://www.hl7.org/fhir/medicationadministration.html
* https://www.hl7.org/fhir/patient.html
