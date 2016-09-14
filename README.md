# homebridge-flirfx

Supports sensors on FlirFX devices with the HomeBridge Platform

This module does not support the motion sensor currently but it's in the works.

This module does not support the video stream as neither does HomeKit.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-flirfx
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample:

 ```
"accessories": [ 
        {
                "accessory" : "FlirFX",
                "ip" : "192.168.0.29",
                "password" : "cameraPassword",
                "name" : "Humidity",
                "service" : "HumiditySensor"
        },
        {
                "accessory" : "FlirFX",
                "ip" : "192.168.0.29",
                "password" : "cameraPassword",
                "name" : "Temperature",
                "service" : "TemperatureSensor"
        }
    ]
```