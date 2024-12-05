/**
 * Blocks for controlling the Cyberbot
 */
namespace cyberbot {

    export enum NavDirection {
        //% block="forward"
        Forward,
        //% block="reverse"
        Reverse,
        //% block="left"
        Left,
        //% block="right"
        Right
    }

    let navLightIsOn = false;

    let leftIsRunning = false;
    let rightIsRunning = false;

    let leftServo = ServoPin.P18
    let rightServo = ServoPin.P19

    let leftForwardSpeed = 75
    let rightForwardSpeed = -75
    let leftReverseSpeed = -75
    let rightReverseSpeed = 75

    /**
     * Toggle the navigation lights
     * @param control The lights state.
     */
    //% blockId="cyberbot_nav_light_toggle" block="navigation light %control"
    //% subcategory="navigation"
    //% control.shadow="toggleOnOff"
    //% weight=180
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
     * @param leftPin is the pin number connected to the left wheel servo, eg: ServoPin.Pin18
     * @param rightPin is the pin number connected to the right wheel servo, eg: ServoPin.Pin19
     */
    //% blockId="cyberbot_set_left_servo" block="set left wheel %leftPin set right wheel %rightPin"
    //% weight=200
    //% subcategory="navigation"
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
    //% weight=190
    //% subcategory="navigation"
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
    //% subcategory="navigation"
    //% group="Directional"
    //% weight=170
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
    //% subcategory="navigation"
    //% group="Directional"
    //% weight=160
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
    //% subcategory="navigation"
    //% weight=150
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
    //% subcategory="navigation"
    //% weight=130
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
    //% subcategory="navigation"
    //% weight=140
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
