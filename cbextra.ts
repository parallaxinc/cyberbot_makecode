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
     * Send a new line to the serial port
     * @param value to send over serial
     */
    //% blockId=serial_new_line block="serial|new line"
    export function newLine(): void {
        serial.writeString("\r\n");
    }
}

//% color=#FFAC00 weight=50 icon="\uf02d" block="Dictionary"
//% blockGap=20
namespace dictionary {
    /**
    * Create a dictionary with keys and values.
    * @param key The keys used for searching.
    * @param value the values that are stored.
    */
    //% blockId="dictionary_create" block="create dictionary: keys $keys                  values $values"
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

    /**
     * Convert a stringified dictionary into an actual dictionary.
     * @param str The string that's to be converted.
     */
    //% blockId="dictionary_str_to_dict" block="convert string $str to dictionary"
    //% str.shadow="text"
    //% weight=20
    export function stringToDictionary(str: string): { [key: string]: any } {
        return JSON.parse(str);
    }

    /**
     * Convert any dictionary into a basic string.
     * @param dict The dictionary that's to be converted
     */
    //% blockId="dictionary_dict_to_str" block="convert dictionary $dict to string"
    //% dict.shadow="variables_get"
    //% weight=21
    export function dictionaryToString(dict: any): string {
        return JSON.stringify(dict);
    }

    /**
     * Search a dictionary using one of the keys contained in it and save the value.
     * @param dict The dictionary to be searched.
     * @param key The key where the value is stored.
     */
    //% blockId="dictionary_search" block="dictionary search $dict for $key"
    //% dict.shadow="variables_get"
    //% dict.variable="myDict"
    //% key.shadow="text"
    //% weight=26
    export function dictionarySearch(dict: any, key: string): any {
        return dict[key]; // Return the value associated with the key
    }

    /**
     * Add any key-value pair to any dictionary that already exists.
     * @param dict The dictionary you want to add to.
     * @param key The key you want to add.
     * @param val The value you want to add.
     */
    //% blockId="dictionary_add" block="add to %dict | key %key value %val"
    //% dict.shadow="variables_get"
    //% val.shadow="math_number"
    //% weight=28
    export function dictAdd(dict: any, key: string, val: any): { [key: string]: any } {
        dict[key] = val;
        return dict;
    }

    /**
     * Remove any key-value pair that is already contained within a dictionary.
     * @param dict The dictionary you want to remove something from.
     * @param key The key for the key-value pair you want to remove.
     */
    //% blockId="dictionary_remove" block="remove pair from %dict: key %key"
    //% dict.shadow="variables_get"
    //% weight=27
    export function dictRemove(dict: any, key: string): { [key: string]: any } {
        delete dict[key];
        return dict;
    }
}

namespace loops {
    /**
    * Create an array from start value to end value incrementing by the desired step size.
    * @param sta The start value, eg:0
    * @param e The end value, eg:10
    * @param ste The size between values, eg:1
    */
    //% sta.defl=0 e.defl=10 ste.defl=1
    //% weight=45 color=#dc143c
    //% blockId="loops_range" block="range|start %sta end %e step %ste"
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
    /**
     * Send a string that is longer than the restricted package length.
     * @param message The long message to be sent.
     */
    //% blockId="radio_send_long_string" block="radio|send long string %message"
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

    /**
     * The long string receiver that is paired with the send long string block.
     * @param handler The variable that the new string is stored in
     */
    //% blockId="radio_long_message_received" block="on radio received"
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
    /**
     * All of the entered text will be set to be completely uppercase and saved.
     * @param str The string that's to be set to uppercase.
     */
    //% blockId="text_set_to_uppercase" block="upper|%str"
    export function setToUpper(str: string): string {
        return str.toUpperCase();
    }
}

namespace basic {
    /**
     * Draws a clock hand on the LED screen.
     * @param direction The time that the clock hand is pointing at.
     * @param interval the amount of time (milliseconds) to show the icon. Default is 600.
     */
    //% weight=40 blockgap=8
    //% blockId="basic_show_clock" block="show clock %i=device_clock"
    //% parts="ledmatrix"
    export function showClock(direction: number, interval = 600) {
        let res = images.clockImage(direction)
        res.showImage(0, interval)
    }
}

namespace images {
    /**
     * The LED matrix for each of the hours on a clock face.
     * @param i Which hour is requested.
     */
    //% weight=40 blockgap=8
    //% blockId="images_clock" block="clock image %i"
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

    /**
     * Returns the actual number associated with the clock's hour name.
     * @param clock The hour name.
     */
    //% weight=40 blockGap=8
    //% blockId="device_clock" block="%clock"
    //% shim=TD_ID
    export function clockNumber(clock: ClockNames): number {
        return clock;
    }
}
