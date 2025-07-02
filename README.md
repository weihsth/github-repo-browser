# GithubRepoBrowser

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.
decided
## Notes

### How long it took me

- Project Setup: ~5 Min
- Coding: ~1,45 Hour
- Generating and fixing Unit tests: ~15 Min
- Extending this Doku: 5 Min
- Uploading the repo: 5 Min 

Complete time was a bit mor than 2 hours, but definitely I wanted to get the unit tests running!

### Structure

Clean Angular/Capacitor setup generated with CLI (see below starting with #Development server).

I added:
./src/app/core
./src/app/features

### Layout

I decided not to use ionic, because it would have been too much overload. I also added a search field, 
to not load all the repos at once. Repos are loaded in 20 item stacks with self written infinite loading.

### Unit tests

There was no time left to test everything, but wrote (with help of ChatGPT) at least some. I added jest for unit tests, because I used it for many years now.

Run ``npm run test`` for running all tests.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
