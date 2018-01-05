# bravia2mqtt
> A bridge between Sony Bravia Smart TVs and MQTT.

[![mqtt-smarthome](https://img.shields.io/badge/mqtt-smarthome-blue.svg)](https://github.com/mqtt-smarthome/mqtt-smarthome)
[![NPM Version][npm-image]][npm-url]
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

bravia2mqtt is a Node.js application that links Sony Bravia smart TVs to an MQTT broker. It is designed to be used to integrate these devices into a home automation system.

## Getting Started

bravia2mqtt is distributed through NPM:

```sh
npm install -g bravia2mqtt

# or, if you prefer:
yarn global add bravia2mqtt
```

Running it is likewise easy:

```sh
bravia2mqtt                      # if your MQTT broker is running on localhost
bravia2mqtt -b mqtt://<hostname> # if your broker is running elsewhere
bravia2mqtt --help               # to see the full usage documentation
```

## Topics and Payloads

This app is intended to conform to the [mqtt-smarthome](http://www.github.com/mqtt-smarthome/mqtt-smarthome/) architecture.  Below is a description of the topics used.

### Status updates

These topics are published as update notifications are received from the TV.

| Topic                               | Value                                                                            |
|-------------------------------------|----------------------------------------------------------------------------------|
| `bravia:<id>/status/isOn`           | The current power status as a boolean
| `bravia:<id>/status/volume`         | The current volume level as an integer
| `bravia:<id>/status/isMuted`        | The current audio mute status as a boolean
| `bravia:<id>/status/channel`        | The current channel as a string of the form `<channel>.<subchannel>`
| `bravia:<id>/status/input`          | The currently selected input as a string (eg. component1, hdmi3)
| `bravia:<id>/status/isPictureMuted` | The current video mute status as a boolean
| `bravia:<id>/status/isPipEnabled`   | The current state of the PIP display as a boolean

### Control

These topics can be used to control various features of the TV.

| Topic Template           | Command | Value Type | Results on                                                               |
|--------------------------|---------|------------|--------------------------------------------------------------------------|
| `bravia:<id>/sendIrCode` | Send an IR code to the TV. See [here](http://www.github.com/forty2/bravia-simple-ip-control/blob/master/KEYS.md) for a full list of codes
| `bravia:<id>/<cmd>/isOn` | get<br>set<br>toggle | boolean | `bravia:<id>/status/isOn`
| `bravia:<id>/<cmd>/volume` | get<br>set | integer | `bravia:<id>/status/volume`
| `bravia:<id>/<cmd>/isMuted` | get<br>set | boolean | `bravia:<id>/status/isMuted`
| `bravia:<id>/<cmd>/channel` | get<br>set | string: `<channel>.<subchannel>` | `bravia:<id>/status/channel`
| `bravia:<id>/<cmd>/tripletChannel` | get<br>set | string: `<x>.<y>.<z>` | `bravia:<id>/status/tripletChannel`
| `bravia:<id>/<cmd>/inputSource` | get<br>set | string: `cable`, `antenna`, etc. | `bravia:<id>/status/inputSource`
| `bravia:<id>/<cmd>/input` | get<br>set | string: `hdmi3`, `component1`, etc. | `bravia:<id>/status/input`
| `bravia:<id>/<cmd>/isPictureMuted` | get<br>set<br>toggle | boolean | `bravia:<id>/status/isPictureMuted`
| `bravia:<id>/<cmd>/isPipEnabled` | get<br>set<br>toggle | boolean | `bravia:<id>/status/isPipEnabled`
| `bravia:<id>/<cmd>/pipPosition` | toggle |         |                                 
| `bravia:<id>/<cmd>/broadcastAddress` | get | string | `bravia:<id>/status/broadcastAddress`
| `bravia:<id>/<cmd>/macAddress` | get | string | `bravia:<id>/status/macAddress`
| `bravia:<id>/<cmd>/sceneSetting` | get<br>set | string: `auto`, `auto24pSync`, `general` | `bravia:<id>/status/sceneSetting`


## Contributing

Contributions are of course always welcome.  If you find problems, please report them in the [Issue Tracker](http://www.github.com/forty2/bravia2mqtt/issues/).  If you've made an improvement, open a [pull request](http://www.github.com/forty2/bravia2mqtt/pulls).

Getting set up for development is very easy:
```sh
git clone <your fork>
cd bravia2mqtt
yarn
```

And the development workflow is likewise straightforward:
```sh
# make a change to the src/ file, then...
yarn build
node dist/index.js

# or if you want to clean up all the leftover build products:
yarn run clean
```

## Release History

* 1.0.0
    * The first release.

## Meta

Zach Bean – zb@forty2.com

Distributed under the MIT license. See [LICENSE](LICENSE.md) for more detail.

[npm-image]: https://img.shields.io/npm/v/bravia2mqtt.svg?style=flat
[npm-url]: https://npmjs.org/package/bravia2mqtt
