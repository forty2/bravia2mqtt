#!/usr/bin/env node

import log from 'yalm';
import MQTT from 'mqtt';

import BraviaDiscovery from 'bravia-simple-ip-control';
import { Observable } from 'rxjs';

import config from './config.js';

log.setLevel(config.verbosity);

BraviaDiscovery
    .on('founddevice', setupNewDevice)
    .on('lostdevice',  forgetDevice)
    .discover();

let clients = { };
let subjects = { };

const STATUS_OPTS = { qos: 2, retain: true };

function getTopic(dev, suffix) {
    return `${config.name}:${dev.id}/${suffix}`;
}

function setupNewDevice(device) {
    log.debug(`Creating client for ${device.id}`);
    let client;
    if (!clients[device.id]) {
        clients[device.id] = client = MQTT.connect(config.broker, {
            will: {
                topic:   getTopic(device, 'connected'),
                payload: '0',
                ...STATUS_OPTS
            }
        });
    }
    else {
	client = clients[device.id];
    }

    client.publish(getTopic(device, 'connected'), '2', STATUS_OPTS);

    const getEventHandler = topic => {
        return function(value) {
            publishMessage({
                topic: getTopic(device, topic),
                message: value,
                client,
                retain: true
            });
        }
    };

    device
        .on("power-changed",       getEventHandler('status/isOn'))
        .on("volume-changed",      getEventHandler('status/volume'))
        .on("mute-changed",        getEventHandler('status/isMuted'))
        .on("channel-changed",     getEventHandler('status/channel'))
        .on("input-changed",       getEventHandler('status/input'))
        .on("piture-mute-changed", getEventHandler('status/isPictureMuted'))
        .on("pip-changed",         getEventHandler('status/isPipEnabled'))

    console.dir(device);
    getMessages(client, getTopic(device, 'set/#'), getTopic(device, 'get/#'), getTopic(device, 'toggle/#'))
        .catch((_, caught) => caught)
        .subscribe(({ topic, message }) => {
            let match = topic.match(/([sg]et|toggle)\/(.*)$/);
            if (match) {
                let [, command, func] = match;

                let obj = device[func];
                if (typeof obj !== 'undefined') {
                    let cmd;
                    if (typeof obj === 'function') {
                        cmd = obj;
                    } else if (command in obj) {
                        cmd = obj[command];
                    }

                    cmd && cmd(message)
                                .subscribe(
                                    getEventHandler(`status/${func}`)
                                );
                }
            }
        })
}

function forgetDevice(device) {
    clients[device.id].publish(getTopic(device, 'connected'), '1', STATUS_OPTS);

    [
        "power-changed",
        "volume-changed",
        "mute-changed",
        "channel-changed",
        "input-changed",
        "piture-mute-changed",
        "pip-changed"
    ]
    .forEach(::device.removeAllListeners);
}

function publishMessage({ topic, message, client, retain }) {
    client.publish(topic, message !== null ? message.toString() : null, { qos: 2, retain });
}

function NOOP() { }
function publishMessages(onError = NOOP, onComplete = NOOP) {
    return this.subscribe(
        publishMessage,
        onError,
        onComplete
    );
}

function getMessages(client, ...topics) {
    return new Observable(
        subscriber => {
            client.subscribe(topics);
            client.on('message', (m_topic, msg) => {
                subscriber.next({
                    topic: m_topic,
                    message: msg.toString()
                })
            });

            return () => {
                client.unsubscribe(topics);
            }
        }
    );
}
