/* eslint-disable*/
module.exports = () => {
	const start = async ({ bus }) => {
		const body = { content: 'Some content' };

		const onError = mess => console.error(mess);
		const onStop = mess => console.warn(mess);
		const subscribe = await bus.subscribe(onError, onStop);
		const subscribeToDlq = await bus.subscribeToDlq(onError, onStop);
		let m, n, o, q = 1;

	
		const processDefaultHandler = async message => {
			console.log('Default. ', m);
			m++;
		};

		const subscribeToTopic = () =>{		
			subscribe('defaultSubscription', processDefaultHandler);
		}

		const processDefaultDlqHandler = async message => {
			console.log('Default dlq ', n);
			n++;
		};

		const subscribeToTopicDlq = () =>{		
			subscribeToDlq('defaultSubscription', processDefaultDlqHandler);
		}

		const publishContents = async () =>{
			n = 1;
			await bus.publish('particleCreated')(body);
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

		return {subscribeToTopic, subscribeToTopicDlq, publishContents, peek, peekDlq, processDlq};
	};
	return { start };
};
