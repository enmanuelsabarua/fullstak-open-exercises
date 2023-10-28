import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://192.168.100.26:5173'
  },
  env: {
    BACKEND: 'http://192.168.100.26:3001/api'
  }
});
