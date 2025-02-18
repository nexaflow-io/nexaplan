// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock environment variables
process.env = Object.assign(process.env, {
  NEXT_PUBLIC_GEMINI_API_KEY: 'test-api-key',
});

// Suppress console.error and console.warn in tests
global.console.error = jest.fn();
global.console.warn = jest.fn();
