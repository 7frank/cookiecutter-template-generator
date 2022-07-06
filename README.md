# overview

A meta generator for [cookiecutter](https://github.com/cookiecutter/cookiecutter)

- initial goal: have a bare MVP working that takes a configuration file, which will create a cookiecutter template from existing source (or project), which again can be used with cookiecutter to create a new project.

# development

- install dependencies globally (esrun,yarn, etc.) then run `yarn` or `npm i`

- run `export DEBUG=* && esrun cookie.generator.ts `

# TODO

- (1) MVP
- (2) create cli with cmd-ts & zod
