require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000);

global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};