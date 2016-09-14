# homebridge-flirfx

Supports sensors on FlirFX devices with the HomeBridge Platform

Motion detection is acheived by checking the camera to see if it is currently recording because of motion detection (i.e. not a manual recording)

This module does not read or access the video stream as HomeKit doesn't have such a feature.

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
        },
        {
                "accessory" : "FlirFX",
                "ip" : "192.168.0.29",
                "password" : "cameraPassword",
                "name" : "Motion",
                "service" : "MotionSensor",
                "refreshInterval" : 10  // check for motion every 10 seconds
        }
    ]
```