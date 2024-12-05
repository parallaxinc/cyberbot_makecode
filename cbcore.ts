/**
 * Blocks for controlling the Cyberbot.
 */
//% color=#1D75B5 weight=100 icon="\uf2db" block="cyber:bot"
//% groups='["Basic Read/Write", "Sound", "Servos", "Sensors", "Other"]'
//% blockGap=8
namespace cyberbot {

    export enum BotPin {
        P0,
        P1,
        P2,
        P3,
        P4,
        P5,
        P6,
        P7,
        P8,
        P9,
        P10,
        P11,
        P12,
        P13,
        P14,
        P15,
        P16,
        P17,
        P18,
        P19,
        P20,
        P21,
        P22
    }

    export enum State {
        //% block="high"
        High = 1,
        //% block="low"
        Low = 2
    }

    export enum ServoPin {
        P18 = 18,
        P19 = 19,
        P16 = 16,
        P17 = 17,
        P0 = 0,
        P1 = 1,
        P2 = 2,
        P3 = 3,
        P4 = 4,
        P5 = 5,
        P6 = 6,
        P7 = 7,
        P8 = 8,
        P9 = 9,
        P10 = 10,
        P11 = 11,
        P12 = 12,
        P13 = 13,
        P14 = 14,
        P15 = 15
    }

    export enum PiezoPin {
        P22 = 22,
        P0 = 0,
        P1 = 1,
        P2 = 2,
        P3 = 3,
        P4 = 4,
        P5 = 5,
        P6 = 6,
        P7 = 7,
        P8 = 8,
        P9 = 9,
        P10 = 10,
        P11 = 11,
        P12 = 12,
        P13 = 13,
        P14 = 14,
        P15 = 15
    }

    export enum Units {
        //% block="μs"
        Us = 1,
        //% block="in"
        In = 2,
        //% block="cm"
        Cm = 3
    }

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

    // Make sure the propeller chips is properly connected
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
     * @param pin  Choose the cyberbot pin to set the state for.
     * @param state  Set the state to HIGH or LOW.
     */
    //% blockId="cyberbot_write_digital" block="digital write pin %pin to %state"
    //% group="Basic Read/Write"
    //% weight=300
    export function writeDigital(pin: BotPin, state: State): void {
        sendCommand(pin, null, state, 0, null, null);
    }

    /**
     * Set a PWM wave in Hz to be output on a desired pin.
     * @param pin Choose the desired cyberbot pin.
     * @param f Set the desired frequency in Hz.
     */
    //% blockId="cyberbot_write_analog" block="analog write pin %pin to %f"
    //% group="Basic Read/Write"
    //% weight=294
    export function writeAnalog(pin: BotPin, f: number): void {
        sendCommand(pin, null, PWM_OUT, 0, f, null);
    }

    /**
     * Read the current state of the desired pin.
     * @param pin Choose the desired cyberbot pin to read.
     */
    //% blockId="cyberbot_read_digital" block="digital read pin %pin"
    //% group="Basic Read/Write"
    //% weight=298
    export function readDigital(pin: BotPin): number {
        sendCommand(pin, null, INPUT, 0, null, null)
        let result = read_r();
        if (result === 1) { return 1; }
        else { return 0; }
    }

    /**
     * Use to compare the Boolean state of the desired pin 1 being True and 0 being False.
     * @param pin Choose the desired cyberbot pin the read.
     */
    //% blockId="cyberbot_read_digital_boole" block="pin %pin is high"
    //% group="Basic Read/Write"
    //% weight=296
    export function readDigitalBoole(pin: BotPin): boolean {
        sendCommand(pin, null, INPUT, 0, null, null)
        let result = read_r();
        if (result === 1) { return true; }
        else { return false; }
    }

    /**
    * Play a note at the desired frequency on the chosen pin for a certain amount of beats. 
    * @param pin Pin connected to the speaker, eg: PiezoPin.Pin22
    * @param frequency Frequency of the tone, eg: Note.C5
    * @param beatLength Length of beat, eg: BeatFraction.Quarter
    */
    //% blockId="cyberbot_play_note" block="on pin %pin play|note %note=device_note|for %duration=device_beat"
    //% frequency.fieldEditor="note" frequency.defl="262"
    //% group="Sound"
    //% weight=304
    export function note(pin: PiezoPin, frequency: number, duration: number): void {
        sendCommand(pin, null, FREQOUT, 0, duration, frequency);
    }

    /**
    * Play a tone in Hz for a specific duration in ms.
    * @param pin Cyberbot pin connected to the speaker, eg: PiezoPin.Pin22
    * @param frequency Frequency of the tone
    * @param duration Duration of the tone in milliseconds, eg: 1000
    */
    //% blockId="cyberbot_play_tone" block="on pin %pin play freq %f for dur %d "
    //% group="Sound"
    //% weight=302
    export function tone(pin: PiezoPin, frequency: number, duration: number): void {
        sendCommand(pin, null, FREQOUT, 0, duration, frequency);
    }

    /**
     * Set the Angle of the servo from 0-180.
     * @param pin The cyberbot pin connected to the servo, eg: ServoPin.Pin18
     * @param angle The desire angle to set the servo to.
     */
    //% blockId="cyberbot_servo_angle" block="set servo angle on pin %pin to %angle"
    //% group="Servos"
    //% weight=396
    export function servoAngle(pin: ServoPin, angle: number = null): void {
        let cmd = SERVO_ANGLE;
        if (angle === null) { cmd = SERVO_DISABLE; }
        sendCommand(pin, null, cmd, 0, angle, null);
    }

    /**
    * Set a servo's speed.
    * @param pin The cyberbot pin connected to the servo, eg: ServoPin.Pin18
    * @param velocity The velocity of the servo from -75 to 75, eg: 0
    */
    //% blockId="cyberbot_servo_speed" block="set servo speed on pin %pin to %velocity"
    //% velocity.min=-75 
    //% velocity.max=75
    //% group="Servos"
    //% weight=400
    export function servoSpeed(pin: ServoPin, velocity: number = null): void {
        let cmd = SERVO_SPEED;
        if (velocity === null) { cmd = SERVO_DISABLE };
        sendCommand(pin, null, cmd, 0, velocity, null);
    }

    /**
     * Set the acceleration of the servo.
     * @param pin The cyberbot pin connected to the servo, eg: ServoPin.Pin18
     * @param acceleration The speed that the servo accelerates, eg: 0
     */
    //% blockId="cyberbot_servo_accelerate" block="set servo acceleration on pin %pin to %acceleration"
    //% group="Servos"
    //% weight=398
    export function servoAccelerate(pin: ServoPin, acceleration: number): void {
        sendCommand(pin, null, SERVO_SETRAMP, 0, acceleration, null)
    }

    /**
    * Stop the servo. 
    * @param pin The cyberbot pin connected to the servo, eg: ServoPin.Pin18
    */
    //% blockId="cyberbot_servo_stop" block="stop servo on pin %pin"
    //% group="Servos"
    //% weight=394
    export function servoStop(pin: ServoPin): void {
        sendCommand(pin, null, SERVO_DISABLE, 0, null, null);
    }

    /**
     * Sends a signal to the in pin causing an IR light of the desired frequency to be output, then reads the out pin and returns a 1 if no IR light was recieved and a 0 if the IR light was recieved making it active low.
     * @param pinIn The cyberbot pin the takes an Input signal and outputs the Light.
     * @param pinOut The cyberbot pin that receives a signal and outputs the state thats detected.
     * @param f The frequency of the IR light being sent out.
     */
    //% blockId="cyberbot_ir_detect" 
    //% block="IR emit on pin %pinIn frequency in Hz %f IR detect on pin %pinOut"
    //% inlineInputMode="external"
    //% group="Sensors"
    //% weight=350
    export function irDetect(pinIn: BotPin, f: number, pinOut: BotPin) {
        sendCommand(pinOut, pinIn, IR_DETECT, 0, f, null);
        return read_r();
    }

    // /**
    //  * Sends a signal to the PING))) which sends out an ultrasonic sound wave and records the time it takes in microseconds for the signal to return then outputs either the time it takes or the distance depending on the units you choose
    //  * @param pin The cyberbot pin connected to the PING))), eg: ServoPin.Pin16
    //  * @param unit The units used for the distance measured
    //  */
    // //% blockId="cyberbot_ping" block="send ping on pin %pin measured in %unit"
    // //% group="Sensors"
    // //% weight=348
    // export function ping(pin: ServoPin, unit: Units) {
    //     sendCommand(pin, null, PING_ECHO, 0, null, null);
    //     let d = read_r();
    //     if (unit == 1) { return d }
    //     else if (unit == 2) { return d / 148 }
    //     else { return d / 58 }
    // }

    /**
     * Reads signals from an IR remote and returns a value equivalent of the button you pressed.
     * @param pin The cyberbot pin connected to the IR receiver.
     */
    //% blockId="cyberbot_ir_remote" block="IR remote detect on pin %pin"
    //% group="Sensors"
    //% weight=349
    export function irRemote(pin: BotPin) {
        sendCommand(pin, null, SIRC, 0, null, null)
        let n = read_r()
        if (n == 255) { n = -1 }
        return n
    }

    /**
     * Reads the signals received from the QTI sensors and stores the binary states in a four bit binary number that is then converted into a decimal value and returned 
     * @param pStart The upper most cyberbot pin of the consecutively used pins
     * @param pEnd The lower most cyberbot pin of the consecutively used pins
     */
    //% blockId="cyberbot_qti_read" block="QTI read from pin %pStart to pin %pEnd"
    //% group="Sensors"
    //% weight=347
    export function qtiRead(pStart: BotPin, pEnd: BotPin) {
        sendCommand(pStart, pEnd, QTI_READ, 0, null, null)
        return read_r();
    }

    /**
     * Take any number and find what the binary value at a desired bit location is.
     * @param bitLoc The number that we want to assess.
     * @param bitShift The location we want to find the binary value at.
     */
    //% blockId="cyberbot_bit_get" block="get bit %bitShift from %bitLoc"
    //% group="Sensors"
    //% weight=346
    export function bitGet(bitShift: number, bitLoc: number) {
        let z = (bitLoc >> bitShift) & 1;
        return z;
    }

    /**
     * Send out a Pulse on the desired pin.
     * @param pin The desired pin.
     * @param d The pulse duration
     */
    //% blockId="cyberbot_pulse_out" block="pulse out for %d on pin %pin "
    //% group="Other"
    //% weight=300
    export function pulseOut(d: number, pin: BotPin): void {
        sendCommand(pin, null, PULSOUT, 0, d, null);
    }

    /**
     * Read the data from the desired pin.
     * @param pin The desired pin.
     * @param s The expected pulse length.
     */
    //% blockId="cyberbot_pulse_in" block="pulse in for %s on pin %pin"
    //% group="Other"
    //% weight=298
    export function pulseIn(s: number, pin: BotPin): number {
        sendCommand(pin, null, PULSIN, s, null, null);
        return read_r();
    }

    /**
     * Reads the length of a pulse received at a desired pin.
     * @param pin The desired pin.
     * @param d The duration it should read for.
     */
    //% blockId="cyberbot_pulse_count" block="pulse count for %d on pin %pin"
    //% group="Other"
    //% weight=296
    export function pulseCount(d: number, pin: BotPin): number {
        sendCommand(pin, null, COUNT, 0, d, null);
        return read_r();
    }
}
