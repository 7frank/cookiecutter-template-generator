# overview

A meta generator for [cookiecutter](https://github.com/cookiecutter/cookiecutter)

- This project currently provides a bare MVP working that takes a configuration file, which will create a cookiecutter template from existing source (or project), which again can be used with cookiecutter to create a new project.

TLDR:

This Project -> create a Config for Existing Code -> generate Cookiecutter Template from existing Code-> Run CookieCutter and generate more Code

# how to

Disclaimer: currently this is only a rough outline and will not work out of the box

- create a cookiecutter template from the configuration provided inside of cookie.generator.ts `export DEBUG=* && esrun cookie.generator.ts -c ./examples/auth-service.ts `
- this will generate files in the ./out folder
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

- install dependencies globally (esrun,yarn, etc.) then run `yarn` or `npm i`

- run `export DEBUG=* && esrun cookie.generator.ts -c ./examples/auth-service.ts ` or `export DEBUG=* && ./cookie.generator.ts -c ./examples/auth-service.ts `

# TODO

- (1) ☑ <strike>MVP</strike>
- (2) ☑ <strike>create cli with cmd-ts & zod that takes a config.ts or json file instead of the currently hard coded version</strike>
  - fix bug that prevents loading config files dynamically
- (3) write tests that also function as bare examples
