require('dotenv').config();

const { ServiceBusClient, ReceiveMode, TopicClient } = require('@azure/service-bus');


const connectionString = process.env.CONNECTION_STRING_SERVICE_BUS;
const topicName = process.env.TOPIC;
const subscriptionName = process.env.SUBSCRIPTION;
const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
const deadLetterTopicName = TopicClient.getDeadLetterTopicPath(topicName);


// Send repaired message back to the current queue / topic
const fixAndResendMessage = async oldMessage => {
	const queueClient = sbClient.createTopicClient(topicName);
	const publisher = queueClient.createSender();

	// Inspect given message and make any changes if necessary
	const repairedMessage = oldMessage.clone();

	console.log('>>>>> Cloning the message from DLQ and resending it - ', oldMessage.body);

	await publisher.send(repairedMessage);
	await queueClient.close();
};


const publishMessage = async () => {
	const queueClient = sbClient.createTopicClient(topicName);
	const sender = queueClient.createSender();

	const message = {
		body: { name: '3Creamy Chicken Pasta', type: 'Dinner' },
		contentType: 'application/json',
		label: 'Recipe',
		userProperties: {
			test: 'testproperty',
		},
	};
	await sender.send(message);
	await queueClient.close();
};

const receiveMessageToDLQ = async () => {
	const queueClient = sbClient.createSubscriptionClient(topicName, subscriptionName);
	const receiver = queueClient.createReceiver(ReceiveMode.peekLock);

	const messages = await receiver.receiveMessages(5);


	if (messages.length) {
		console.log(
			'>>>>> Deadletter the one message received from the main queue - ',
			messages[0].body,
		);
		console.log(messages);

		for (message in messages) {
			if (message.label === 'Recipe') {
			// Send to Deadletter the message received
				await message.deadLetter({
					deadletterReason: 'Incorrect Recipe type',
					deadLetterErrorDescription: 'Recipe type does not match preferences.',
				});
			} else {
				await message.complete();
			}
		}
	} else {
		console.log('>>>> Error: No messages were received from the main queue.');
	}

	await queueClient.close();
};

const processDeadletterMessageQueue = async () => {
	const topicClient = sbClient.createQueueClient(deadLetterTopicName);
	const receiver = topicClient.createReceiver(ReceiveMode.peekLock);

	const messages = await receiver.receiveMessages(1);

	if (messages.length > 0) {
		console.log('>>>>> Received the message from DLQ - ', messages[0].body);

		// Do something with the message retrieved from DLQ
		await fixAndResendMessage(messages[0]);

		// Mark message as complete/processed.
		await messages[0].complete();
	} else {
		console.log('>>>> Error: No messages were received from the DLQ.');
	}

	await topicClient.close();
};

main().catch(err => {
	console.log('Error occurred: ', err);
});


async function main() {
	try {
		// Publish a message to ensure that there is atleast one message in the main queue
		await publishMessage();
		await receiveMessageToDLQ();
		// await processDeadletterMessageQueue();
	} finally {
		await sbClient.close();
	}
}

main().catch(err => {
	console.log('Error occurred: ', err);
});
