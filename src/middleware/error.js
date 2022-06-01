const winston = require('winston');
//Auto save logs to mongodb
require('winston-mongodb');

//Create logger & transport for errors of "errors", "warnings", "info"
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'Recipes' },
  transports: [
    //Send errors here
    new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
    //Send anything above warning here
    new winston.transports.File({ filename: 'src/logs/warnings.log', level: 'warn' }),
    //Send anything above info here
    new winston.transports.File({ filename: 'src/logs/info.log', level: 'info' }),
    //Save error to database and pass in database details
    new winston.transports.MongoDB({ db: 'mongodb://localhost:37017/recipes' })
  ]
});

//Log express errors
function error(err, req, res, next) {
  console.log(err.message, err);
  logger.error(err.message, err);
  res.status(500).send('Something failed on the server. Try again.');
}

//Handle uncaughtException & unhandledRejection which are errors that occur outside of express
//Log uncaught sync exception (general error)
process.on('uncaughtException', (ex) => {
  console.log('uncaughtException', ex);
  logger.error(ex.message, ex);
  //Exit the application to reset everything
  process.exit(1);
});

///Log unhandled async rejection (promise error)
process.on('unhandledRejection', (ex) => {
  console.log('unhandledRejection', ex);
  logger.error(ex.message, ex);
});

//Error Middleware
module.exports = error;