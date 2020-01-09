# systemicBusDLQ-POC

A POC for investigating DLQ and retry policies on systemic-azure-bus for Azure Service Bus.

It includes these endpoints:

- **POST**: \_/publish (Will publish a message on the topic)
- **POST**: \_/subscribe-dlq/ (Will return an error with the deadLetterQueue strategy)
- **POST**: \_/subscribe-retry/ (Will return an error with the retry strategy)
- **POST**: \_/subscribe-retry-recover/ (Will fail on the first 2 attempts with the retry strategy and finally work on the third attempt)
- **POST**: \_/subscribe-eb/ (Will return an error with the exponentialBackoff strategy)
- **POST**: \_/processdlq/ (Will clean the messages on the dead letter queue)
- **POST**: \_/peekdlq/ (Will check for messages on the dead letter queue, without consuming them)
- **POST**: \_/peek/ (Will check for messages on the topic, without consuming them)