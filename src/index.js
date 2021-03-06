module.exports = {
    apigateway: {
        Request: require('./apigateway/request-client'),
        Response: require('./apigateway/response-client'),
        Validator: require('./apigateway/request-validator'),
        Router: require('./apigateway/router')
    },
    dynamodb: {
        Event: require('./dynamodb/event-client'),
        Record: require('./dynamodb/record-client')
    },
    logger: {
        setup: require('./common/setup-logger').setUpLogger,
        Logger: require('./common/logger')
    },
    s3: {
        Event: require('./s3/event-client'),
        Record: require('./s3/record-client')
    },
    sqs: {
        Event: require('./sqs/event-client'),
        Record: require('./sqs/record-client')
    }
};
