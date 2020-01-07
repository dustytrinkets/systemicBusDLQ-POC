# systemicBusDLQ-POC

A POC for investigating DLQ and retry policies on systemic-azure-bus for Azure Service Bus.

Before running, add this function and export it on the systemic-azure-bus index.js:

```
    const subscribeToDlq = onError => (subscriptionId, handler) => {
        const { topic, subscription, errorHandling } = subscriptions[subscriptionId] || {};
        if (!topic || !subscription) throw new Error(`Data for subscription ${subscriptionId} non found!`);
        const receiver = topicClientFactory.createReceiver(topic, subscription);

        const onMessageHandler = async brokeredMessage => {
            const topicErrorStrategies = {
                retry: errorStrategies.retry(topic),
                deadLetter: errorStrategies.deadLetter(topic),
                exponentialBackoff: errorStrategies.exponentialBackoff(topic, topicClientFactory),
            };
            try {
                enqueuedItems++;
                debug(`Enqueued items increase | ${enqueuedItems} items`);
                debug(`Handling message on topic ${topic}`);
                await handler({ body: getBodyDecoded(brokeredMessage.body, brokeredMessage.userProperties.contentEncoding), userProperties: brokeredMessage.userProperties, properties: getProperties(brokeredMessage) });
                await brokeredMessage.deadLetter({
                    deadletterReason: 'Incorrect Recipe type',
                    deadLetterErrorDescription: 'Recipe type does not match preferences.',
                });
            } catch (e) {
                const subscriptionErrorStrategy = (errorHandling || {}).strategy;
                const errorStrategy = e.strategy || subscriptionErrorStrategy || 'retry';
                debug(`Handling error with strategy ${errorStrategy} on topic ${topic}`);
                const errorHandler = topicErrorStrategies[errorStrategy] || topicErrorStrategies.retry;
                await errorHandler(brokeredMessage, errorHandling || {});
            } finally {
                enqueuedItems--;
                debug(`Enqueued items decrease | ${enqueuedItems} items`);
            }
        };
        receiver.registerMessageHandler(onMessageHandler, onError, { autoComplete: false });
    };
```