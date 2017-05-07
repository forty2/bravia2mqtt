var pkg = require('../package.json');

var config = require('yargs')
    .usage(pkg.name + ' ' + pkg.version + '\n' + pkg.description + '\n\nUsage: $0 [options]')
    //.describe('v', 'possible values: "error", "warn", "info", "debug"')
    .describe('h', 'show help')
    .describe('b', 'mqtt broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
    .describe('n', 'base name for MQTT topics')
    .alias({
        'b': 'broker',
        'h': 'help',
        'n': 'name',
        'v': 'verbosity'
    })
    .default({
        'b': 'mqtt://127.0.0.1',
        'n': 'bravia',
        'v': 'info'
    })
    .check(argv => argv.broker.match(/^(?:mqtt|mqtts|tcp|tls|ws|wss)/))
    .version()
    .help('help')
    .argv;

export {
    config as default
};
