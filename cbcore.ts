enum BotPin {
    Pin0,
    Pin1,
    Pin2,
    Pin3,
    Pin4,
    Pin5,
    Pin6,
    Pin7,
    Pin8,
    Pin9,
    Pin10,
    Pin11,
    Pin12,
    Pin13,
    Pin14,
    Pin15,
    Pin16,
    Pin17,
    Pin18,
    Pin19,
    Pin20,
    Pin21,
    Pin22
}

enum State {
    High = 1,
    Low = 2
}

enum ServoPin {
    Pin18 = 18,
    Pin19 = 19,
    Pin16 = 16,
    Pin17 = 17,
    Pin0 = 0,
    Pin1 = 1,
    Pin2 = 2,
    Pin3 = 3,
    Pin4 = 4,
    Pin5 = 5,
    Pin6 = 6,
    Pin7 = 7,
    Pin8 = 8,
    Pin9 = 9,
    Pin10 = 10,
    Pin11 = 11,
    Pin12 = 12,
    Pin13 = 13,
    Pin14 = 14,
    Pin15 = 15
}

enum PiezoPin {
    Pin22 = 22,
    Pin0 = 0,
    Pin1 = 1,
    Pin2 = 2,
    Pin3 = 3,
    Pin4 = 4,
    Pin5 = 5,
    Pin6 = 6,
    Pin7 = 7,
    Pin8 = 8,
    Pin9 = 9,
    Pin10 = 10,
    Pin11 = 11,
    Pin12 = 12,
    Pin13 = 13,
    Pin14 = 14,
    Pin15 = 15
}

enum NavDirection {
    Forward,
    Reverse,
    Left,
    Right
}

enum Units {
    US = 1,
    IN = 2,
    CM = 3
}

/**
 * Start of the custom Cyberbot category containing all of the blocks in that category
 */
//% color=#1D75B5 weight=100 icon="\uf2db" block="cyber:bot"
//% groups='["Basic Read/Write", "Sound", "Servos", "Sensors", "Other"]'
//% blockGap=4
namespace cyberbot {

    // Communtication constants for the propeller chip to run the proper code sent to it
    export const HIGH = 1
    export const LOW = 2
    export const INPUT = 3
    export const TOGGLE = 4
    //const SETDIRS       = 5
    //const GETDIRS       = 6
    //const SETSTATES     = 7
    //const GETSTATES     = 8
    //const PAUSE         = 9
    export const PULSIN = 10
    export const PULSOUT = 11
    export const COUNT = 12
    export const FREQOUT = 13
    export const RCTIME = 16
    //const SHIFTIN       = 17
    //const SHIFTOUT      = 18
    //const SEROUT        = 19
    //const SERIN         = 20
    export const SERVO_ANGLE = 24
    export const SERVO_SPEED = 25
    //const SERVO_SET     = 26
    export const SERVO_SETRAMP = 27
    export const SERVO_DISABLE = 28
    //const SERVO_DRIVE   = 34
    export const PING_ECHO = 29
    export const SIRC = 30
    export const IR_DETECT = 31
    export const PWM_OUT = 32
    export const QTI_READ = 33
    //const HANDSHAKE     = 99
    //const PWR_LED_WARN  = 25
    //const PWR_BRN_DET   = 24

    //const PWR_LED_WARN  = 15
    //const PWR_BRN_DET   = 14    

    export const ADDRESS = 93

    let isConnected = false;

    let navLightIsOn = false;

    let leftIsRunning = false;
    let rightIsRunning = false;

    let leftServo = ServoPin.Pin18
    let rightServo = ServoPin.Pin19

    let leftForwardSpeed = 75
    let rightForwardSpeed = -75
    let leftReverseSpeed = -75
    let rightReverseSpeed = 75

    // Make sure the propeller chip is properly connected
    function connect() {

        while (true) {
            pins.digitalWritePin(DigitalPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P8, 1)
            pause(10);
            if (pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE) !== 0) {
                //pins.digitalWritePin(DigitalPin.P8, 1)
                pause(10);
                pins.i2cWriteNumber(ADDRESS, 12, NumberFormat.UInt16LE);
                pause(10);
                isConnected = true;
                break;
            }
        }
    }

    function botDisable(): void {
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        basic.pause(200);
        control.reset();
    }

    // Sends the proper information to the propeller chip in a format it will understand
    export function sendCommand(pinA: number, pinB: number = null, cmd: number, s = 0, d: number = null, f: number = null): void {
        if (isConnected === false) {
            connect()
        }

        // build args and write
        if (pinB == null) {
            pinB = 33;
        }
        let args = Buffer.fromArray([1, pinA, pinB, s]);
        if (d !== null) {
            let duration = pins.createBuffer(4)
            duration.setNumber(NumberFormat.Int32LE, 0, Math.round(d))
            args = Buffer.concat([args, duration]);
        }
        if (f !== null) {
            let freq = pins.createBuffer(4)
            freq.setNumber(NumberFormat.Int32LE, 0, Math.round(f))
            args = Buffer.concat([args, freq]);
        }
        console.log(args.toHex())
        pins.i2cWriteBuffer(ADDRESS, args);

        // build command and write
        pins.i2cWriteBuffer(ADDRESS, Buffer.fromArray([0, cmd]));

        // wait until prop is done
        let check = 1
        while (check !== 0) {
            pins.i2cWriteNumber(ADDRESS, 0, NumberFormat.UInt8LE);
            check = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt8LE);
        }
    }

    function read_r(): number {
        pins.i2cWriteNumber(ADDRESS, 18, NumberFormat.UInt32LE)
        return pins.i2cReadBuffer(ADDRESS, 4)[3]
    }

    /**
     * Set a desired pin to be either HIGH or LOW.
     * @param pin  Choose the pin for which to set the state.
     * @param state  Set the state to HIGH or LOW.
     */
    //% blockId="cyberbot_write_digital" block="%p write digital %s"
    //% group="Basic Read/Write"
    //% weight=100
    export function writeDigital(pin: BotPin, state: State): void {
        sendCommand(pin, null, state, 0, null, null);
    }

    /**
     * Set a PWM wave in Hz to be output on a desired pin.
     * @param pin Choose the desired pin.
     * @param f Set the desired frequency in Hz.
     */
    //% blockId="cyberbot_write_analog" block="%pin write analog %f"
    //% group="Basic Read/Write"
    //% weight=94
    export function writeAnalog(pin: BotPin, f: number): void {
        sendCommand(pin, null, PWM_OUT, 0, f, null);
    }

    /**
     * Read the current state of the desired pin.
     * @param pin Choose the desired pin to read.
     */
    //% blockId="cyberbot_read_digital" block="%pin read digital"
    //% group="Basic Read/Write"
    //% weight=98
    export function readDigital(pin: BotPin): number {
        sendCommand(pin, null, INPUT, 0, null, null)
        let result = read_r();
        if (result === 1) { return 1; }
        else { return 0; }
    }

    /**
     * Use to compare the Boolean state of the desired pin 1 being True and 0 being False.
     * @param pin Choose the desired pin to read.
     */
    //% blockId="cyberbot_read_digital_boole" block="%pin is high"
    //% group="Basic Read/Write"
    //% weight=96
    export function readDigitalBoole(pin: BotPin): boolean {
        sendCommand(pin, null, INPUT, 0, null, null)
        let result = read_r();
        if (result === 1) { return true; }
        else { return false; }
    }

    /**
    * Play a note at the desired frequency on the chosen pin for a certain amount of beats. 
    * @param pin The pin connected to the speaker, eg: PiezoPin.Pin22
    * @param frequency Frequency of the tone, eg: Note.C5
    * @param beatLength Length of beat, eg: BeatFraction.Quarter
    */
    //% blockId="cyberbot_play_note" block="%pin play|note %note=device_note|for %duration=device_beat"
    //% frequency.fieldEditor="note" frequency.defl="262"
    //% group="Sound"
    //% weight=104
    export function note(pin: PiezoPin, frequency: number, duration: number): void {
        sendCommand(pin, null, FREQOUT, 0, duration, frequency);
    }

    /**
    * Play a tone in Hz for a specific duration in ms.
    * @param pin The pin connected to the speaker, eg: PiezoPin.Pin22
    * @param frequency Frequency of the tone
    * @param duration Duration of the tone in milliseconds, eg: 1000
    */
    //% blockId="cyberbot_play_tone" block="%pin tone freq %f dur %d "
    //% pin.fieldEditor="gridpicker"
    //% group="Sound"
    //% weight=102
    export function tone(pin: PiezoPin, frequency: number, duration: number): void {
        sendCommand(pin, null, FREQOUT, 0, duration, frequency);
    }

    /**
     * Set the Angle of the servo from 0-180.
     * @param pin The pin connected to the servo, eg: ServoPin.Pin18
     * @param angle The desired angle to set the servo to.
     */
    //% blockId="cyberbot_servo_angle" block="%pin servo angle %v"
    //% group="Servos"
    //% weight=196
    export function servoAngle(pin: ServoPin, angle: number = null): void {
        let cmd = SERVO_ANGLE;
        if (angle === null) { cmd = SERVO_DISABLE; }
        sendCommand(pin, null, cmd, 0, angle, null);
    }

    /**
    * Set a servo's speed.
    * @param pin The pin connected to the servo, eg: ServoPin.Pin18
    * @param velocity The velocity of the servo from -75 to 75, eg: 0
    */
    //% blockId="cyberbot_servo_speed" block="%pin servo speed %velocity"
    //% velocity.min=-75 
    //% velocity.max=75
    //% group="Servos"
    //% weight=200
    export function servoSpeed(pin: ServoPin, velocity: number = null): void {
        let cmd = SERVO_SPEED;
        if (velocity === null) { cmd = SERVO_DISABLE };
        sendCommand(pin, null, cmd, 0, velocity, null);
    }

    /**
     * Set the acceleration of the servo.
     * @param pin The pin connected to the servo, eg: ServoPin.Pin18
     * @param acceleration The speed that the servo accelerates, eg: 0
     */
    //% blockId="cyberbot_servo_accelerate" block="%pin servo accelerate %acceleration"
    //% group="Servos"
    //% weight=198
    export function servoAccelerate(pin: ServoPin, acceleration: number): void {
        sendCommand(pin, null, SERVO_SETRAMP, 0, acceleration, null)
    }

    /**
    * Stop the servo. 
    * @param pin The pin connected to the servo, eg: ServoPin.Pin18
    */
    //% blockId="cyberbot_servo_stop" block="%pin servo stop"
    //% group="Servos"
    //% weight=194
    export function servoStop(pin: ServoPin): void {
        sendCommand(pin, null, SERVO_DISABLE, 0, null, null);
    }

    /**
     * Sends a signal to the in pin causing an IR light of the desired frequency to be output, then reads the out pin and returns a 1 if no IR light was received and a 0 if the IR light was received making it active low.
     * @param pinIn The pin the takes an Input signal and outputs the Light.
     * @param pinOut The pin that receives a signal and outputs the state that is detected.
     * @param f The frequency of the IR light being sent out.
     */
    //% blockId="cyberbot_ir_detect" block="ir detect|in %pinIn out %pinOut hz %f"
    //% group="Sensors"
    //% weight=150
    export function irDetect(pinIn: BotPin, pinOut: BotPin, f: number) {
        sendCommand(pinOut, pinIn, IR_DETECT, 0, f, null);
        return read_r();
    }

    /**
     * Sends a signal to the PING))) which sends out an ultrasonic sound wave and records the time it takes in microseconds for the signal to return then outputs either the time it takes or the distance depending on the units you choose
     * @param pin The pin connected to the PING))), eg: ServoPin.Pin16
     * @param unit The units used for the distance measured
     */
    //% blockId="cyberbot_ping" block="ping distance|in %pin units %unit"
    //% group="Sensors"
    //% weight=148
    export function ping(pin: ServoPin, unit: Units) {
        sendCommand(pin, null, PING_ECHO, 0, null, null);
        let d = read_r();
        if (unit == 1) { return d }
        else if (unit == 2) { return d / 148 }
        else { return d / 58 }
    }

    /**
     * Reads signals from an IR remote and returns a value equivalent to the button you pressed.
     * @param pin The pin connected to the IR receiver.
     */
    //% blockId="cyberbot_ir_remote" block="ir remote|pin %pin"
    //% group="Sensors"
    //% weight=149
    export function irRemote(pin: BotPin) {
        sendCommand(pin, null, SIRC, 0, null, null)
        let n = read_r()
        if (n == 255) { n = -1 }
        return n
    }

    /**
     * Reads the signals received from the QTI sensors and stores the binary states in a four-bit binary number that is then converted into a decimal value and returned 
     * @param pStart The uppermost pin of the consecutive used pins
     * @param pEnd The lowermost pins of the consecutive used pins
     */
    //% blockId="cyberbot_qti_read" block="qti read|start %pStart end %pEnd"
    //% group="Sensors"
    //% weight=147
    export function qtiRead(pStart: BotPin, pEnd: BotPin) {
        sendCommand(pStart, pEnd, QTI_READ, 0, null, null)
        return read_r();
    }

    /**
     * Take any number and find the binary value at a desired bit location.
     * @param bitLoc The number that we want to assess.
     * @param bitShift The location we want to find the binary value at.
     */
    //% blockId="cyberbot_bit_get" block="bit get from %bitLoc at %bitShift"
    //% group="Sensors"
    //% weight=146
    export function bitGet(bitLoc: number, bitShift: number) {
        let z = (bitLoc >> bitShift) & 1;
        return z;
    }

    /**
     * Send out a Pulse on the desired pin.
     * @param pin The desired pin.
     * @param d The pulse duration
     */
    //% blockId="cyberbot_pulse_out" block="%pin pulse out %d"
    //% group="Other"
    //% weight=100
    export function pulseOut(pin: BotPin, d: number): void {
        sendCommand(pin, null, PULSOUT, 0, d, null);
    }

    /**
     * Read the data from the desired pin.
     * @param pin The desired pin.
     * @param s The expected pulse length.
     */
    //% blockId="cyberbot_pulse_in" block="%pin pulse in %s"
    //% group="Other"
    //% weight=98
    export function pulseIn(pin: BotPin, s: number): number {
        sendCommand(pin, null, PULSIN, s, null, null);
        return read_r();
    }

    /**
     * Reads the length of a pulse received at a desired pin.
     * @param pin The desired pin.
     * @param d The duration it should read for.
     */
    //% blockId="cyberbot_pulse_count" block="%pin pulse count %d"
    //% group="Other"
    //% weight=96
    export function pulseCount(pin: BotPin, d: number): number {
        sendCommand(pin, null, COUNT, 0, d, null);
        return read_r();
    }

    /**
     * Determine the RC time of a circuit using a desired pin.
     * @param pin The desired pin
     * @param s The time it should read for.
     */
    //% blockId="cyberbot_rc_time" block="%pin rc time %s %d %f"
    //% group="Other"
    //% weight=95
    export function rcTime(pin: BotPin, s: number): number {
        sendCommand(pin, null, RCTIME, s, null, null);
        return read_r();
    }

    /**
     * Toggle the navigation lights
     * @param control The lights state.
     */
    //% blockId="cyberbot_nav_light_toggle" block="navigation light %control"
    //% subcategory="Navigation"
    //% control.shadow="toggleOnOff"
    //% weight=890
    //% group="Settings"
    export function navLightToggle(control: boolean): void {
        navLightIsOn = control;
    }

    function leftNavLight(speed: number) {
        while (leftIsRunning) {
            if (speed > 0) {
                for (let i = 2; i <= 6; i++) {
                    if (leftIsRunning) {
                        led.toggle(4, i % 5)
                        pause(100)
                        led.toggle(4, i % 5)
                    }
                    else { break }
                }
            }
            else if (speed < 0) {
                for (let i = 7; i >= 3; i--) {
                    if (leftIsRunning) {
                        led.toggle(4, i % 5)
                        pause(100)
                        led.toggle(4, i % 5)
                    }
                    else { break }
                }
            }
        }
    }

    function rightNavLight(speed: number) {
        while (rightIsRunning) {
            if (speed < 0) {
                for (let i = 2; i <= 6; i++) {
                    if (rightIsRunning) {
                        led.toggle(0, i % 5)
                        pause(100)
                        led.toggle(0, i % 5)
                    }
                    else { break }
                }
            }
            else if (speed > 0) {
                for (let i = 7; i >= 3; i--) {
                    if (rightIsRunning) {
                        led.toggle(0, i % 5)
                        pause(100)
                        led.toggle(0, i % 5)
                    }
                    else { break }
                }
            }
        }
    }

    /**
     * Choose the pins connected to each wheel's servo. 
     * @param leftPin is the pin connected to the left wheel servo, eg: ServoPin.Pin18
     * @param rightPin is the pin connected to the right wheel servo, eg: ServoPin.Pin19
     */
    //% blockId="cyberbot_set_left_servo" block="set left wheel %leftPin set right wheel %rightPin"
    //% weight=1000
    //% subcategory="Navigation"
    //% inlineInputMode="external"
    //% group="Settings"
    export function setLeftServo(leftPin: ServoPin, rightPin: ServoPin): void {
        leftServo = leftPin;
        rightServo = rightPin;
    }

    /**
     * Calibrate the servos
     * @param fAdjustment Forward adjustments
     * @param rAdjustment Reverse adjustments
     */
    //% blockId="cyberbot_calibrate" block="calibrate forward: %fAdjustment calibrate backward: %bAdjustment"
    //% fAdjustment.min=-15
    //% fAdjustment.max=15
    //% rAdjustment.min=-15
    //% rAdjustment.max=15
    //% inlineInputMode="external"
    //% weight=900
    //% subcategory="Navigation"
    //% group="Settings"
    export function calibrate(fAdjustment: number, rAdjustment: number): void {
        leftForwardSpeed -= fAdjustment;
        rightForwardSpeed -= fAdjustment;
        leftReverseSpeed += rAdjustment;
        rightReverseSpeed += rAdjustment;
    }

    /**
    * Set the bot on a path. It will not stop unless told to stop. 
    * @param direction, eg: NavDirection.Forward
    */
    //% blockId="cyberbot_nav_forever" block="go %direction"
    //% subcategory="Navigation"
    //% group="Directional"
    //% weight=200
    export function navForever(direction: NavDirection): void {
        leftIsRunning = false;
        rightIsRunning = false;
        stop();
        pause(100)
        let leftSpeed: number;
        let rightSpeed: number;
        if (direction === NavDirection.Forward) {
            leftSpeed = leftForwardSpeed;
            rightSpeed = rightForwardSpeed;
        }
        else if (direction === NavDirection.Reverse) {
            leftSpeed = leftReverseSpeed;
            rightSpeed = rightReverseSpeed;
        }
        else if (direction === NavDirection.Left) {
            leftSpeed = leftReverseSpeed;
            rightSpeed = rightForwardSpeed;
        }
        else if (direction === NavDirection.Right) {
            leftSpeed = leftForwardSpeed;
            rightSpeed = rightReverseSpeed;
        }
        sendCommand(leftServo, null, SERVO_SPEED, 0, leftSpeed);
        sendCommand(rightServo, null, SERVO_SPEED, 0, rightSpeed);
        leftIsRunning = true;
        rightIsRunning = true;
        if (navLightIsOn) {
            control.inBackground(() => leftNavLight(leftSpeed));
            control.inBackground(() => rightNavLight(rightSpeed));
        }
        pause(10);
    }

    /**
    * Move the bot in a direction for a certain number of seconds. 
    * @param direction, eg: NavDirection.Forward
    * @param duration Duration of time in seconds, eg: 1
    */
    //% blockId="cyberbot_nav_duration" block="go %direction for %duration seconds"
    //% subcategory="Navigation"
    //% group="Directional"
    //% weight=100
    export function navDuration(direction: NavDirection, duration: number): void {
        let leftSpeed: number;
        let rightSpeed: number;
        if (direction === NavDirection.Forward) {
            leftSpeed = leftForwardSpeed;
            rightSpeed = rightForwardSpeed;
        }
        else if (direction === NavDirection.Reverse) {
            leftSpeed = leftReverseSpeed;
            rightSpeed = rightReverseSpeed;
        }
        else if (direction === NavDirection.Left) {
            leftSpeed = leftReverseSpeed;
            rightSpeed = rightForwardSpeed;
        }
        else if (direction === NavDirection.Right) {
            leftSpeed = leftForwardSpeed;
            rightSpeed = rightReverseSpeed;
        }
        sendCommand(leftServo, null, SERVO_SPEED, 0, leftSpeed);
        sendCommand(rightServo, null, SERVO_SPEED, 0, rightSpeed);
        pause(duration * 1000)
        stop()
    }

    /**
    * Set the bot on a path at a certain percent of full speed. 
    * @param direction, eg: NavDirection.Forward
    * @param speed Percentage of full speed, eg: 100
    */
    //% speed.min=0
    //% speed.max=100
    //% blockId="cyberbot_nav_speed" block="go %direction at %speed \\% full speed"
    //% subcategory="Navigation"
    //% weight=35
    //% group="Directional"
    export function navSpeed(direction: NavDirection, speed: number): void {
        if (speed > 100) { speed = 100; }
        if (speed < 0) { speed = 0; }
        let leftSpeed: number;
        let rightSpeed: number;
        if (direction === NavDirection.Forward) {
            leftSpeed = speed * leftForwardSpeed / 100;
            rightSpeed = speed * rightForwardSpeed / 100;
        }
        else if (direction === NavDirection.Reverse) {
            leftSpeed = speed * leftReverseSpeed / 100;
            rightSpeed = speed * rightReverseSpeed / 100;
        }
        else if (direction === NavDirection.Left) {
            leftSpeed = speed * leftReverseSpeed / 100;
            rightSpeed = speed * rightForwardSpeed / 100;
        }
        else if (direction === NavDirection.Right) {
            leftSpeed = speed * leftForwardSpeed / 100;
            rightSpeed = speed * rightReverseSpeed / 100;
        }
        sendCommand(leftServo, null, SERVO_SPEED, 0, leftSpeed);
        sendCommand(rightServo, null, SERVO_SPEED, 0, rightSpeed);

        pause(10)
    }

    /**
     * Stop the left and right wheels' servos.
     */
    //% blockId="cyberbot_stop" block="stop wheels"
    //% subcategory="Navigation"
    //% weight=0
    //% group="Directional"
    export function stop(): void {
        leftIsRunning = false;
        rightIsRunning = false;
        sendCommand(leftServo, null, SERVO_DISABLE, 0, null);
        sendCommand(rightServo, null, SERVO_DISABLE, 0, null);
    }

    /**
     * Drive by specifying how fast each wheel should spin and for how long.
     * @param leftSpeed A percentage of the left wheel's full speed, eg: 100
     * @param rightSpeed A percentage of the right wheel's full speed, eg: 100
     * @param time Time in seconds, eg: 1 
     */
    //% blockId="cyberbot_precision_drive" block="set left wheel power %leftSpeed set right wheel power %rightSpeed drive for duration (sec) $time"
    //% subcategory="Navigation"
    //% weight=25
    //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.shadow="speedPicker"
    //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.shadow="speedPicker"
    //% inlineInputMode="external"
    //% group="Controlled"
    export function precisionDrive(leftSpeed: number, rightSpeed: number, time: number): void {
        leftSpeed = leftSpeed
        rightSpeed = -1 * rightSpeed
        sendCommand(leftServo, null, SERVO_SPEED, 0, leftSpeed);
        sendCommand(rightServo, null, SERVO_SPEED, 0, rightSpeed);
        pause(time * 1000)
        sendCommand(leftServo, null, SERVO_DISABLE, 0, null);
        sendCommand(rightServo, null, SERVO_DISABLE, 0, null);
    }
}
