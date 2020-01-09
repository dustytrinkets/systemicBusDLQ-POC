/* eslint-disable*/
module.exports = () => {
	const start = async ({ bus }) => {
		const body = { content: 'Some content' };
		const metadata = {
			userProperties:{
				attempts: 7
			},
		}

		const onError = mess => {
			console.error(mess);
		}
		const onStop = mess => console.warn(mess);
		const subscribe = await bus.subscribe(onError, onStop);
		let q = 1;
		let received = 0;


		const publishContents = async () =>{
			received = 0;
			await bus.publish('particleCreated')(body, metadata);
		}

		const subscriptionDlqHandler = async message => {
			const error = new Error('Throwing an error to force going to DLQ');
			error.strategy = 'deadLetter';
			throw error;
		};

		const subscribeExponentialBackoffHandler = async message => {
			const error = new Error('Throwing an error to force exponential backoff');
			error.strategy = 'exponentialBackoff';
			throw error;
		};
	
		const subscriptionRetryHandler = async message => {
			const error = new Error('Throwing an error to force retry');
			error.strategy = 'retry';
			throw error;
		};

		const subscriptionRetryRecoverHandler = async message => {
			received++;
			if (received < 3) throw new Error('Throwing an error to force abandoning the message');
			console.log('Correctly received')
		};

		const subscribeDlq = () =>{		
			subscribe('defaultSubscription', subscriptionDlqHandler);
		}

		const subscribeExponentialBackoff = () =>{		
			subscribe('defaultSubscription', subscribeExponentialBackoffHandler);
		}

		const subscribeRetry = () =>{		
			subscribe('defaultSubscription', subscriptionRetryHandler);
		}

		const subscribeRetryRecover = () =>{		
			subscribe('defaultSubscription', subscriptionRetryRecoverHandler);
		}

		const processDlqHandler = async message => {
			console.log('Dead letter queue', q);
			await message.complete();
			q++;
		};
		
		const processDlq = async () => {
			q = 1;
			bus.processDlq('defaultSubscription', processDlqHandler);
		}

		const peekDlq = async () => {
			let messages = await bus.peekDlq('defaultSubscription', 100);
			return messages
		}

		const peek = async () => {
			let messages = await bus.peek('defaultSubscription', 100);
			return messages
		}

		return {subscribeDlq, subscribeRetry, subscribeRetryRecover, subscribeExponentialBackoff, publishContents, peek, peekDlq, processDlq};
	};
	return { start };
};
