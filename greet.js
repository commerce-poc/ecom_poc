#!/usr/bin/env node
const { register } = require("./controllers/authController");

const args = process.argv.slice(2); // Ignore the first two arguments (node and script path)

if (args.length === 0) {
  console.log('Usage: greet <name>');
  process.exit(1);
}

const username = args[0];
const password = args[1];
register({username, password})
