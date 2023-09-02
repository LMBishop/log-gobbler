import express from 'express';
import { logger } from './logger.js';
import { connect as connectDatabase } from './config/database.js';
import { router as indexRouter } from './route/index.route.js';
import { router as siteRouter } from './route/site.route.js';
import { watchFiles } from './log/setup.js';
import config from 'config';

const app = express();

app.set('view engine', 'ejs');

logger.info(`Starting at ${new Date().toString()}`);

try {
    await connectDatabase();
    logger.info('Connected to database');
} catch (e) {
    logger.error('Unable to connect to database');
    logger.error(e);
    process.exit(1);
}

watchFiles();

app.use('/static', express.static('static'));

app.use(indexRouter);
app.use(siteRouter);

app.listen(config.get('port'), () => {
    logger.info(`Server started on port ${config.get('port')}`);
});
