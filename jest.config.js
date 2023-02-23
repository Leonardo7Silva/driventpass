module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules", "src"],
    transform: {
      ".+\\.ts$": "ts-jest",
    },
    moduleNameMapper: {
      "@/(.*)": "<rootDir>/src/$1",
      "@test/(.*)": "<rootDir>/tests/$1",
      "axios": "axios/dist/node/axios.cjs"
    },
    testMatch: ["<rootDir>/tests/integration/*.(test|spec).ts"],
  };