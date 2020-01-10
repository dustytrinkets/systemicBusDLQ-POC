# systemic azure bus error handling policies POC

A POC for investigating the error handling policies on **systemic-azure-bus** for **Azure Service Bus**.

It includes the following endpoints:

- **POST**: \_/_publish_ (Will publish a message on the topic)
- **POST**: \_/_subscribe-dlq_ (Will return an error with the deadLetterQueue strategy)
- **POST**: \_/_subscribe-retry_ (Will return an error with the retry strategy)
- **POST**: \_/_subscribe-retry-recover_ (Will fail on the first 2 attempts with the retry strategy and finally work on the third attempt)
- **POST**: \_/_subscribe-eb_ (Will return an error with the exponentialBackoff strategy)
- **POST**: \_/_processdlq_ (Will clean the messages on the dead letter queue)
- **POST**: \_/_peekdlq_ (Will check for messages on the dead letter queue, without consuming them)
- **POST**: \_/_peek_ (Will check for messages on the topic, without consuming them)