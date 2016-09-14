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
    this.log("Added FlirFX " + this.service + " '" + this.name + "'...");
}

FlirFXAccessory.prototype.getTemp = function(callback) {
    var self = this;

    request({
        url: "http://" + self.ip + "/API/1.0/ChiconyCameraLogin",
        method: "POST",
        json: true,
        body: {
            "password" : self.password
        }
    }, function (error, response, body){
        
        request({
            url: "http://" + self.ip + "/API/1.1/CameraStatus",
            method: "POST",
            json: true,
            body: {
                "getCameraStatus" : ""
            },
            headers: {
                "Cookie" : "Session=" + body.session
            }
        }, function (error, response, body){
            if(body.errorCode) {
                callback(new Error("Error from device"), null);
            }
            callback(null, body.temperature.tempValue);
        });
    });
}

FlirFXAccessory.prototype.getHumidty = function(callback) {
    var self = this;

    request({
        url: "http://" + self.ip + "/API/1.0/ChiconyCameraLogin",
        method: "POST",
        json: true,
        body: {
            "password" : self.password
        }
    }, function (error, response, body){
        
        request({
            url: "http://" + self.ip + "/API/1.1/CameraStatus",
            method: "POST",
            json: true,
            body: {
                "getCameraStatus" : ""
            },
            headers: {
                "Cookie" : "Session=" + body.session
            }
        }, function (error, response, body){
            if(body.errorCode) {
                callback(new Error("Error from device"), null);
            }
            callback(null, body.humidity.humidityLevel);
        });
    });
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
    }
    return [this._service];
}