const { handleError, tagError } = require('../../lib/errors/errorHandler');

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		app.post('/subscribe-dlq', async (req, res, next) => {
			try {
				const result = await controller.subscribeDlq();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/subscribe-retry', async (req, res, next) => {
			try {
				const result = await controller.subscribeRetry();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/subscribe-retry-recover', async (req, res, next) => {
			try {
				const result = await controller.subscribeRetryRecover();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/subscribe-eb', async (req, res, next) => {
			try {
				const result = await controller.subscribeExponentialBackoff();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/publish', async (req, res, next) => {
			try {
				const result = await controller.publishContents();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/peek', async (req, res, next) => {
			try {
				const result = await controller.peek();
				return res.json({ messageCount: result.length, messages: result });
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/peekdlq', async (req, res, next) => {
			try {
				const result = await controller.peekDlq();
				return res.json({ messageCount: result.length, messages: result });
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/processdlq', async (req, res, next) => {
			try {
				const result = await controller.processDlq();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleError(logger));
	};

	return { start };
};
