import chalk from 'chalk';

export const logInfo = (message) => {
  console.log(chalk.blue(`[INFO] ${message}`));
};

export const logWarning = (message) => {
  console.log(chalk.yellow(`[WARNING] ${message}`));
};

export const logError = (message) => {
  console.error(chalk.red(`[ERROR] ${message}`));
};

export const logSuccess = (message) => {
  console.log(chalk.green(`[SUCCESS] ${message}`));
};