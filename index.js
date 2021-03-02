const express = require('express');
const helmet = require('helmet');
const logger = require('./logger');
const router = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
