/**
 * Blocks for controlling the Cyberbot
 */
namespace cyberbot {

    export enum ClockNames {
        //% blockIdentity=cyberbot.clockNumber block="twelve"
        Twelve = 0,
        //% blockIdentity=cyberbot.clockNumber block="one"
        One,
        //% blockIdentity=cyberbot.clockNumber block="two"
        Two,
        //% blockIdentity=cyberbot.clockNumber block="three"
        Three,
        //% blockIdentity=cyberbot.clockNumber block="four"
        Four,
        //% blockIdentity=cyberbot.clockNumber block="five"
        Five,
        //% blockIdentity=cyberbot.clockNumber block="six"
        Six,
        //% blockIdentity=cyberbot.clockNumber block="seven"
        Seven,
        //% blockIdentity=cyberbot.clockNumber block="eight"
        Eight,
        //% blockIdentity=cyberbot.clockNumber block="nine"
        Nine,
        //% blockIdentity=cyberbot.clockNumber block="ten"
        Ten,
        //% blockIdentity=cyberbot.clockNumber block="eleven"
        Eleven,
    }

    /**
     * Draws a clock hand on the LED screen.
     * @param direction The time that the clock hand is pointing at.
     * @param interval the amount of time (milliseconds) to show the icon. Default is 600.
     */
    //% blockId="cyberbot_show_clock" block="show clock %i=device_clock"
    //% subcategory="support"
    //% group="Basic" 
    //% color=#1E90FF
    //% weight=140
    //% parts="ledmatrix"
    export function showClock(direction: number, interval = 600) {
        let res = cyberbot.clockImage(direction)
        res.showImage(0, interval)
    }

    /**
    * Create a dictionary with keys and values.
    * @param key The keys used for searching.
    * @param value the values that are stored.
    */
    //% blockId="cyberbot_create" block="create dictionary: keys $keys                  values $values"
    //% keys.shadow="lists_create_with"
    //% keys.shadowArgs="TEXT" keys.defl="text"
    //% values.shadow="lists_create_with"
    //% values.shadowArgs="NUM" values.defl="math_number"
    //% inlineInputMode="external"
    //% subcategory="support"
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=130
    export function createDictionary(keys: string[], values: any[]): { [key: string]: any } {
        let dictionary: { [key: string]: any } = {};

        for (let i = 0; i < keys.length; i++) {
            dictionary[keys[i]] = values[i];
        }

        return dictionary;
    }

    /**
     * Change any key value pair to any dictionary that already exists.
     * @param dict The dictionary you want to change something in. eg: dictionary
     * @param key The key you want to change.
     * @param val The value you want to change.
     */
    //% blockId="cyberbot_dict_change" block="change in %dict | key %key value %val"
    //% dict.shadow="variables_get"
    //% val.shadow="math_number"
    //% subcategory="support" 
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=120
    export function dictChange(dict: any, key: string, val: any): { [key: string]: any } {
        dict[key] = val;
        return dict;
    }

    /**
     * Add any key value pair to any dictionary that already exists.
     * @param dict The dictionary you want to add to. eg: dictionary
     * @param key The key you want to add.
     * @param val The value you want to add.
     */
    //% blockId="cyberbot_dict_add" block="add to %dict | key %key value %val"
    //% dict.shadow="variables_get"
    //% val.shadow="math_number"
    //% subcategory="support" 
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=110
    export function dictAdd(dict: any, key: string, val: any): { [key: string]: any } {
        dict[key] = val;
        return dict;
    }

    /**
     * Remove any key value pair that is already contained within a dictionary.
     * @param dict The dictionary you want to remove something from. eg: dictionary
     * @param key The key for the key value pair you want to remove.
     */
    //% blockId="cyberbot_dict_remove" block="remove pair from %dict: key %key"
    //% dict.shadow="variables_get"
    //% subcategory="support" 
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=100
    export function dictRemove(dict: any, key: string): { [key: string]: any } {
        delete dict[key];
        return dict;
    }

    /**
     * Search a dictionary using one of the keys contained in it and save the value.
     * @param dict The dictionary to be searched. eg: dictionary
     * @param key The key where the value is stored.
     */
    //% blockId="cyberbot_dict_search" block="dictionary search $dict for $key"
    //% dict.shadow="variables_get"
    //% dict.variable="myDict"
    //% key.shadow="text"
    //% subcategory="support" 
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=90
    export function dictionarySearch(dict: any, key: string): any {
        return dict[key]; // Return the value associated with the key
    }

    /**
     * Convert any dictionary into a basic string.
     * @param dict The dictionary wanting to be converted. eg: dictionary
     */
    //% blockId="cyberbot_dict_to_str" block="convert dictionary $dict to string"
    //% dict.shadow="variables_get"
    //% subcategory="support" 
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=80
    export function dictionaryToString(dict: any): string {
        return JSON.stringify(dict);
    }

    /**
     * Convert a stringified dictionary into an actual dictionary.
     * @param str The string wanting to be converted.
     */
    //% blockId="cyberbot_str_to_dict" block="convert string $str to dictionary"
    //% str.shadow="text"
    //% subcategory="support"
    //% group="Dictionary"
    //% color=#FFAC00 
    //% weight=70
    export function stringToDictionary(str: string): { [key: string]: any } {
        return JSON.parse(str);
    }

    /**
     * Send a string that is longer than the restricted package length.
     * @param message The long message to be sent.
     */
    //% blockId="cyberbot_send_long_string" block="radio|send long string %message"
    //% subcategory="support"
    //% group="Radio"
    //% color=#E3008C 
    //% weight=60
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
    //% blockId="cyberbot_long_message_received" block="on radio received" draggableParameters=reporter
    //% subcategory="support"
    //% group="Radio"
    //% color=#E3008C 
    //% weight=50
    export function onLongMessageReceived(cb: (rLongString: string) => void) {
        let completeMessage = "";

        radio.onReceivedString(function (receivedString: string) {
            if (receivedString === "END") {
                cb(completeMessage);  // Call the callback function with the complete message
                completeMessage = ""; // Reset for the next message
            } else {
                completeMessage += receivedString; // Append the received chunk
            }
        });
    }

    /**
    * Create an array from start value to end value incrementing by the desired step size.
    * @param sta The start value, eg:0
    * @param e The end value, eg:10
    * @param ste The size between values, eg:1
    */
    //% sta.defl=0 e.defl=10 ste.defl=1
    //% blockId="cyberbot_range" block="range|start %sta end %e step %ste"
    //% subcategory="support"
    //% group="Loops"
    //% color=#E65722
    //% weight=40
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

    /**
     * Set all of the entered text will be set to be completely uppercase and saved.
     * @param str The string thats to be set to uppercase.
     */
    //% blockId="cyberbot_set_to_uppercase" block="set %str to upper"
    //% subcategory="support"
    //% group="Text"
    //% color=#B8860B 
    //% weight=30
    export function setToUpper(str: string): string {
        return str.toUpperCase();
    }

    /**
     * Print a line of text to the serial port
     * @param value to send over serial
     */
    //% blockId=cyberbot_new_line block="serial|new line"
    //% subcategory="support"
    //% group="Serial"
    //% color=#002050 
    //% weight=20
    export function newLine(): void {
        serial.writeString("\r\n");
    }

    /**
     * Returns the actual number associated with the clocks hour name.
     * @param clock The hour name.
     */
    //% subcategory="support" blockHidden=1
    //% group="Images"
    //% weight=10 blockGap=8
    //% blockId="device_clock" block="%clock"
    //% color=#7600A8 
    //% shim=TD_ID
    export function clockNumber(clock: ClockNames): number {
        return clock;
    }

    /**
     * The LED matrix for each of the hours on a clock face.
     * @param i Which hour is requested.
     */
    //% blockId="cyberbot_clock" block="clock image %i" 
    //% subcategory="support" blockHidden=1
    //% group="Images"
    //% color=#7600A8 
    //% weight=5
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
}
