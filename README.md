# overview

A meta generator for [cookiecutter](https://github.com/cookiecutter/cookiecutter)

- This project currently provides a bare MVP working that takes a configuration file, which will create a cookiecutter template from existing source (or project), which again can be used with cookiecutter to create a new project.

TLDR:

This Project -> create a Config for Existing Code -> generate Cookiecutter Template from existing Code-> Run CookieCutter and generate more Code

# installation

- install esrun `npm i -g @digitak/esrun`
- install dependencies then run `yarn` or `npm i`
- (optional) run `npm link` to install the `ctg` cli on your system

# how to

Disclaimer: currently this is only a rough outline and will not work out of the box

- follow the installation section
- create a cookiecutter template

  - you may choose any file format or language you want here. The Result must be JSON that conforms to the CookieGenerator Schema
  - an example config exists at `./examples/auth-service.ts`
  - run the example like the following: `esrun ./examples/auth-service.ts | ctg -` which will first compile the example and output a JSON string that again is piped to the ctg cli

- following the steps above will generate files in the ./out folder (which are are a valid cookiecutter template)
- now run `cookiecutter ./out/` which will ask you for some variables and create files & folders that from the previously generated cookiecutter template

```
repository_name []: ServiceInformationInquiryCreation
package_name []: core-component-serviceinformationinquiry-application
service_name []: ServiceInformationInquiryCreation
check_name []: ServiceInformationInquiryCreation
default_service_error []: No permission to create service information inquiry.
check_method_name []: checkServiceInformationInquiryCreationEntitlement
```

# development

- run `esrun ./examples/auth-service.ts | ctg -`

  or

- `esrun ./examples/auth-service.ts | esrun ./cookie.generator.ts`

# TODO

- (1) ☑ <strike>MVP</strike>
- (2) ☑ <strike>create cli takes a config.ts or json file as input</strike>
- (3) add option to override generator input (node-fetch & gunzip-maybe & tar-stream & rxjs-stream)
  - e.g. `esrun ./examples/auth-service.ts | ctg - -i https://github.com/Baeldung/kotlin-tutorials/tarball/master`
- (4) write tests that also function as bare examples
- (5) add some asciinema example that showcases a minimal example
