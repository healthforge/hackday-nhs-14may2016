# healthforge-recipe-smart-on-fhir-angular

A recipe for creating an AngularJS SMART-on-FHIR app.

Based on https://github.com/AngularClass/NG6-starter.

##TL;DR

Install `node` and `npm`, then the following dependencies:

	npm install -g gulp karma karma-cli webpack

For development:

	npm install
	gulp watch

To run the development reverse proxy:

	gulp proxy

For production:

	npm install
	gulp build

##Generators

Angular really just uses three things:

- Components
- Services
- Directives

Components and Services should be ES6 classes. It is simplest to keep Directives as functions.

You can generate classes as follows:

###Generating Components (https://github.com/AngularClass/NG6-starter)

Following a consistent directory structure between components offers us the certainty of predictability. We can take advantage of this certainty by creating a gulp task to automate the "instantiation" of our components. The component boilerplate task generates this:

	⋅⋅⋅⋅⋅⋅componentName/
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.js // entry file where all its dependencies load
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.js
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.controller.js
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.html
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.styl // scoped to affect only its own template
	⋅⋅⋅⋅⋅⋅⋅⋅componentName.spec.js // contains passing demonstration tests

You may, of course, create these files manually, every time a new module is needed, but that gets quickly tedious. To generate a component, run gulp component --name componentName.

The parameter following the --name flag is the name of the component to be created. Ensure that it is unique or it will overwrite the preexisting identically-named component.

The component will be created, by default, inside client/app/components. To change this, apply the --parent flag, followed by a path relative to client/app/components/.

For example, running gulp component --name signup --parent auth will create a signup component at client/app/components/auth/signup.

Running gulp component --name footer --parent ../common creates a footer component at client/app/common/footer.

Because the argument to --name applies to the folder name and the actual component name, make sure to camelcase the component names.