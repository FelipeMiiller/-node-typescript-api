import { resolve } from 'path';



// eslint-disable-next-line no-undef
const root = resolve(__dirname);


// eslint-disable-next-line @typescript-eslint/no-var-requires
const rootConfig = require(`../${root}/jest.config.js`);




export default {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
}}


