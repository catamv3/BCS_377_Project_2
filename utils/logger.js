// utils/logger.js
// Simple logging utility for student projects

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Log info message
 */
function info(message) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

/**
 * Log success message
 */
function success(message) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

/**
 * Log warning message
 */
function warn(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

/**
 * Log error message
 */
function error(message, err) {
  console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
  if (err) {
    console.error(err);
  }
}

module.exports = {
  info,
  success,
  warn,
  error
};
