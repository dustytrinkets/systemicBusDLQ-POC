module.exports = {
	server: {
		host: '0.0.0.0',
		port: 6003,
	},
	routes: {
		admin: {
			swaggerOptions: {
				swaggerDefinition: {
					info: {
						description: 'Documentation for serviceBusLogger',
						title: 'serviceBusLogger',
						version: '1.0.0',
					},
					host: process.env.SERVICE_ENV || 'localhost:4000',
					basePath: '/v1',
					produces: ['application/json'],
					schemes: ['http'],
					securityDefinitions: {
						JWT: {
							type: 'apiKey',
							in: 'header',
							name: 'Authorization',
							description: '',
						},
					},
				},
			},
		},
	},
	bus: {
		// retryNum:,
		connection: {
			connectionString: process.env.CONNECTION_STRING_SERVICE_BUS,
		},
		subscriptions: {
			defaultSubscription: {
				topic: 'guarreo-laura.systemic-bus-filters-poc.particle.created',
				subscription: 'guarreo-laura.filters-poc.particle.default',
				// errorHandling: {
				// 	strategy: 'exponentialBackoff', // 'retry' || 'deadLetter'
				// 	options: { // for 'exponentialBackoff' option only
				// 		attempts: 5,
				// 		measure: 'minutes',
				// 	},
				// },
			},
		},
		publications: {
			particleCreated: {
				topic: 'guarreo-laura.systemic-bus-filters-poc.particle.created',
			},
		},
	},
	metrics: {
		key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
		internalLogging: false,
		context: {
			tags: {
				'ai.cloud.role': process.env.npm_package_name,
				'ai.cloud.roleInstance': process.env.HOSTNAME || 'local',
			},
		},
		autoCollect: {
			requests: true,
			performance: true,
			exceptions: true,
			dependencies: true,
			console: false,
		},
	},
	logger: {
		transport: 'console',
		include: ['tracer', 'timestamp', 'level', 'message', 'error.message', 'error.code', 'error.stack', 'request.url', 'request.headers', 'request.params', 'request.method', 'response.statusCode', 'response.headers', 'response.time', 'process', 'system', 'package.name', 'service'],
		exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
	},
};
