const { handleError, tagError } = require('../../lib/errors/errorHandler');

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		app.post('/subscribe', async (req, res, next) => {
			try {
				const result = await controller.subscribeToTopic();
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/subscribedlq', async (req, res, next) => {
			try {
				const result = await controller.subscribeToTopicDlq();
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
				return res.json(result);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.post('/peekdlq', async (req, res, next) => {
			try {
				const result = await controller.peekDlq();
				return res.json(result);
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
