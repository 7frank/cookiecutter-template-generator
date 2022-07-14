import { CookieGenerator, Replace } from "../src/types";

const replace: Replace[] = [
  { src: "Vehicle Position Inquiry", trg: "Deputy Assignment" }, // in strings
  { src: "vehiclepositioninquiry", trg: "deputyassignment" }, // in path & namespace
  { src: "vehicle position inquiry", trg: "deputy assignment" }, // in strings
  { src: "VehiclePositionInquiry", trg: "DeputyAssignment" }, //classes
  { src: "vehiclePositionInquiry", trg: "deputyAssignment" }, // functions
  { src: "VEHCILE_POSITION_INQUIRY", trg: "DEPUTY_ASSIGNMENT" }, // constants
  { src: "vehicle_position_inquiry", trg: "deputy_assignment" }, // in test function names by bdd
];

const replace2: Replace[] = [
  { src: "getVehicleInformationInquiry", trg: "getAssignedDeputy" },
  //{ src: "vehiclepositioninquiry", trg: "deputyassignment" },
];

const generator: CookieGenerator = {
  source: "../authority-tooling",
  repository: "{{cookiecutter.repository_name}}",
  target: "./out/minimal-crud-template",
  configuration: {
    main: {
      include: ["**/ui-api-rest-core-component-vehiclepositioninquiry/**"],
      exclude: [".git", "**/build/**"],

      replaceInPath: [...replace, ...replace2],
      replaceInFile: [...replace, ...replace2],
    },
  },
};

console.log(JSON.stringify(generator, null, "  "));
