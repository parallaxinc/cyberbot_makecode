enum ClockNames {
    //% blockIdentity=images.clockNumber block="Twelve"
    Twelve = 0,
    //% blockIdentity=images.clockNumber block="One"
    One,
    //% blockIdentity=images.clockNumber block="Two"
    Two,
    //% blockIdentity=images.clockNumber block="Three"
    Three,
    //% blockIdentity=images.clockNumber block="Four"
    Four,
    //% blockIdentity=images.clockNumber block="Five"
    Five,
    //% blockIdentity=images.clockNumber block="Six"
    Six,
    //% blockIdentity=images.clockNumber block="Seven"
    Seven,
    //% blockIdentity=images.clockNumber block="Eight"
    Eight,
    //% blockIdentity=images.clockNumber block="Nine"
    Nine,
    //% blockIdentity=images.clockNumber block="Ten"
    Ten,
    //% blockIdentity=images.clockNumber block="Eleven"
    Eleven,
}

namespace serial {
    /**
     * Print a line of text to the serial port
     * @param value to send over serial
     */
    //% blockId=serial_newline block="serial|new line"
    export function NewLine(): void {
        serial.writeString("\r\n");
    }
}

//% color=#FFAC00 weight=50 icon="\uf02d" block="Dictionary"
//% blockGap=20
namespace dictionary {
    /*
    * Create a dictionary with keys and values.
    * @param key The keys used for searching
    * @param value the values used for searching
    */
    //% block="create dictionary: keys $keys                  values $values"
    //% keys.shadow="lists_create_with"
    //% keys.shadowArgs="TEXT" keys.defl="text"
    //% values.shadow="lists_create_with"
    //% values.shadowArgs="NUM" values.defl="math_number"
    //% inlineInputMode="external"
    //% weight=30
    export function createDictionary(keys: string[], values: any[]): { [key: string]: any } {
        let dictionary: { [key: string]: any } = {};

        for (let i = 0; i < keys.length; i++) {
            dictionary[keys[i]] = values[i];
        }

        return dictionary;
    }


    //% block="convert string $str to dictionary"
    //% str.shadow="text"
    //% weight=20
    export function stringToDictionary(str: string): { [key: string]: any } {
        return JSON.parse(str);
    }


    //% block="convert dictionary $dict to string"
    //% weight=21
    export function dictionaryToString(dict: any): string {
        return JSON.stringify(dict);
    }


    //% block="dictionary search $dict for $key"
    //% dict.shadow="variables_get"
    //% dict.variable="myDict"
    //% key.shadow="text"
    //% weight=10
    export function dictionarySearch(dict: any, key: string): any {
        return dict[key] // Return the value associated with the key
    }
}

namespace loops {
    /*
    * Create an array from start value to end value incrementing by the desired step size.
    * @param sta The start value, eg:0
    * @param e The end value, eg:10
    * @param ste The size between values, eg:1
    */
    //% sta.defl=0 e.defl=10 ste.defl=1
    //% weight=45 color=#dc143c
    //% blockId=range block="range|start %sta end %e step %ste"
    export function range(sta: number = 0, e: number = 10, ste: number = 1): number[] {
        let rangeArray = [];
        let freq = sta;
        if (ste < 0) {
            while (freq >= e) {
                rangeArray.push(freq)
                freq += ste;
            }
        } else {
            while (freq <= e) {
                rangeArray.push(freq)
                freq += ste;
            }
        }
        return rangeArray;
    }
}

namespace radio {

    //% block="radio|send long string %message"
    //% weight=58 group="Send" blockGap=10
    export function sendLongString(message: string) {
        let chunkSize = 19; // Set the maximum size for each chunk
        let numberOfChunks = Math.ceil(message.length / chunkSize);

        for (let i = 0; i < numberOfChunks; i++) {
            let chunk = message.substr(i * chunkSize, chunkSize);
            radio.sendString(chunk); // Send the chunk
            basic.pause(100); // Small pause to avoid overwhelming the receiver
        }

        // Send an end signal
        radio.sendString("END");
    }

    //% block="on radio received"
    export function onLongMessageReceived(handler: (rLongString: string) => void) {
        let completeMessage = "";

        radio.onReceivedString(function (receivedString: string) {
            if (receivedString === "END") {
                handler(completeMessage);  // Call the callback function with the complete message
                completeMessage = ""; // Reset for the next message
            } else {
                completeMessage += receivedString; // Append the received chunk
            }
        });
    }
}


namespace text {

    //% block="upper|%str"
    export function setToUpper(str: string): string {
        return str.toUpperCase();
    }
}

namespace basic {
    /**
     * Draws an clock hand on the LED screen
     * @param direction the time of the clock hand
     * @param interval the amount of time (milliseconds) to show the icon. Default is 600.
     */
    //% weight=40 blockgap=8
    //% block="show clock %i=device_clock"
    //% parts="ledmatrix"
    //% help=basic/show-clock
    export function showClock(direction: number, interval = 600) {
        let res = images.clockImage(direction)
        res.showImage(0, interval)
    }
}

namespace images {

    //% weight=40 blockgap=8
    //% help=images/clock-image
    //% block="clock image %i"
    export function clockImage(i: ClockNames): Image {
        switch (i) {
            // compass directions
            case ClockNames.Twelve: return images.createImage(`
                                        . . # . .
                                        . . # . .
                                        . . # . .
                                        . . . . .
                                        . . . . .`);
            case ClockNames.One: return images.createImage(`
                                        . . . # .
                                        . . . # .
                                        . . # . .
                                        . . . . .
                                        . . . . .`);
            case ClockNames.Two: return images.createImage(`
                                        . . . . .
                                        . . . # #
                                        . . # . .
                                        . . . . .
                                        . . . . .`);
            case ClockNames.Three: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # # #
                                        . . . . .
                                        . . . . .`);
            case ClockNames.Four: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # . .
                                        . . . # #
                                        . . . . .`);
            case ClockNames.Five: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # . .
                                        . . . # .
                                        . . . # .`);
            case ClockNames.Six: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # . .
                                        . . # . .
                                        . . # . .`);
            case ClockNames.Seven: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # . .
                                        . # . . .
                                        . # . . .`);
            case ClockNames.Eight: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . # . .
                                        # # . . .
                                        . . . . .`);
            case ClockNames.Nine: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        # # # . .
                                        . . . . .
                                        . . . . .`);
            case ClockNames.Ten: return images.createImage(`
                                        . . . . .
                                        # # . . .
                                        . . # . .
                                        . . . . .
                                        . . . . .`);
            case ClockNames.Eleven: return images.createImage(`
                                        . # . . .
                                        . # . . .
                                        . . # . .
                                        . . . . .
                                        . . . . .`);
            default: return images.createImage(`
                                        . . . . .
                                        . . . . .
                                        . . . . .
                                        . . . . .
                                        . . . . .
                                        `);
        }
    }

    //% weight=40 blockGap=8
    //% help=images/clock-number
    //% blockId=device_clock block="%clock"
    //% shim=TD_ID
    export function clockNumber(clock: ClockNames): number {
        return clock;
    }
}