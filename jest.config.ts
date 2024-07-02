import { type Config } from "jest";

const testRegex = "(/__tests__/.*|(\\.|/)(unit\\.test))\\.(js?|ts?)?$";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex,
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
