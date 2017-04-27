# TODO

## Browser
- [ ] Create basic interface
- [ ] Make the library cross-browser
- [ ] Small size


## Server
- [ ] Create same interface for server


```js

const form = require('formapi');

form.settings({
	constrains : [
		'path1',
		'path2',
		'path3',
	], //path for autloading constraint rules
}) // Global settings



const login = form('login', {

	})
	.parse(request);

login.files() // Return file streams
login.validate() // Return array of field errors or null
login.fields() // Maybe with files data ?
login.toJSON()
login.toString()

login.submit() // can override sumit params

// Client side api

login.on('input').on('change')
login.off('input').off('change').off('error')

login.fields() // Get all fields data as Object
login.fields({
	login: 'Azazaza',
}) // Set data fo fields

login.field('login', data) // Set data to field
login.field('login') // Get field data, if data with [] - return array. If form don't have field, throw error

```

## Develop

- [ ] Create git hook


## Tests
- [ ] Create tests with

## Documentation

## Also

- [ ] Create GH Page
- [ ] Write easy to understand README.md with GIF
- [ ] Write articles for Medium and Habrahabr
- [ ] Add library in cdnjs (https://github.com/cdnjs/cdnjs/blob/master/CONTRIBUTING.md)
- [ ] Add badges Travis.CI - build, coverage,
- [ ] Create typescript version (https://github.com/ansman/validate.js/blob/master/validate.d.ts), (https://github.com/ansman/validate.js/blob/master/typings.json)

## Important

- CSRF
- Remote validations (and separated validation by browser and server)
