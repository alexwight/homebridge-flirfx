var request = require('request');
var Service, Characteristic;

module.exports = function(homebridge){
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-flirfx", "FlirFX", FlirFXAccessory);
}

function FlirFXAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.ip = config["ip"];
    this.password = config["password"];
    this.service = config["service"] || "TemperatureSensor";
    this.refreshInterval = config["refreshInterval"] || 1;
    this.motionDetected = false;
    this.log("Added FlirFX " + this.service + " '" + this.name + "'...");
    this.sessionid = null;
}

FlirFXAccessory.prototype.login = function(callback) {
    var self = this;

    request({
            url: "http://" + self.ip + "/API/1.0/ChiconyCameraLogin",
            method: "POST",
            json: true,
            body: {
                "password" : self.password
            }
        }, function (error, response, body){
            self.sessionid = body.session;
            if(callback) callback();
        }
    );
}

FlirFXAccessory.prototype.getCameraStatus = function(callback) {
    var self = this;

    if(!self.sessionid) {
        // not logged in
        self.login();
        return callback(null);
    }

    request({
        url: "http://" + self.ip + "/API/1.1/CameraStatus",
        method: "POST",
        json: true,
        body: {
            "getCameraStatus" : ""
        },
        headers: {
            "Cookie" : "Session=" + self.sessionid
        }
    }, function (error, response, body){
        if(body.errorCode) {
            // possibly login session expired
            self.login();
            return callback(null);
        }
        callback(body);
    });
}

FlirFXAccessory.prototype.getTemp = function(callback) {
    var self = this;
    this.getCameraStatus(function(status) {
        if(!status) {
            // try again in a few seconds
            setTimeout(self.getTemp.bind(this, callback), 5000);
            return;
        }
        callback(null, status.temperature.tempValue);
    }.bind(this));
}

FlirFXAccessory.prototype.getHumidty = function(callback) {
    var self = this;
    this.getCameraStatus(function(status) {
        if(!status) {
            setTimeout(self.getHumidty.bind(this, callback), 5000);
            return;
        }
        callback(null, status.humidity.humidityLevel);
    }.bind(this));
}

FlirFXAccessory.prototype.checkMotion = function() {
    var self = this;
    this.getCameraStatus(function(status) {
        if(!status) {
            return;
        }
        $motion = status.recorderStatus == 2;
        if($motion != self.motionDetected) {
            self._service.getCharacteristic(Characteristic.MotionDetected)
                .setValue($motion);
            self.motionDetected = $motion;
            self.log("Motion detected on device '" + self.name + "'...");
        }
    }.bind(this));
  
}

FlirFXAccessory.prototype.getServices = function() {
  
    if(this.service == "TemperatureSensor") {
        this._service = new Service.TemperatureSensor(this.name);
        this._service
          .getCharacteristic(Characteristic.CurrentTemperature)
          .on('get', this.getTemp.bind(this));
    } else if(this.service == "HumiditySensor") {
        this._service = new Service.HumiditySensor(this.name);
        this._service
          .getCharacteristic(Characteristic.CurrentRelativeHumidity)
          .on('get', this.getHumidty.bind(this));
    } else if(this.service == "MotionSensor") {
        this._service = new Service.MotionSensor(this.name);
        this.timer = setInterval(this.checkMotion.bind(this), this.refreshInterval * 1000);
    }
    return [this._service];
}