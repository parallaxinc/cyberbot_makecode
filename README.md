# Makecode Extension for the Cyber:bot Product
Use this Library to add blocks for the [cyber:bot Robot Kit – with micro:bit](https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/)

## Cyber:bot Makecode Tutorials
// put link to tutorials here //

## Basic Read Write
This section contains the blocks you will need to do basic reading and writing of any of the pins labeled P0-P22 on the Cyber:bot which are different than the ones used by the Micro:bit.

Write high or low to any of the pins.
```typescript
cyberbot.writeDigital(BotPin.Pin21, State.High)
cyberbot.writeDigital(BotPin.Pin21, State.Low)
```
Read from any of the pins and store the results in a variable.
```typescript
let pin_state = cyberbot.readDigital(BotPin.Pin21)
```
Compare the state of a pin and write an analog signal (in Hz) to a pin if the first pin is high.
```typescript
if (cyberbot.readDigitalBoole(BotPin.Pin8)) {
    cyberbot.writeAnalog(BotPin.Pin10, 5000)
}
```

## Sound
There are two blocks in this section that allow you to play a frequency intended for a piezo speaker through pins labeled P0-P15 and P22 on the Cyber:bot.

The first option allows you to choose a specific note on a piano from Low C (131 Hz) to High B (988 Hz), as well as how long you want it to play in beats.
```typescript
cyberbot.note(PiezoPin.Pin22, 262, music.beat(BeatFraction.Whole))
```
The second option allows you to choose a frequency in Hz (5000) and a duration in ms (1 second) that the speaker will play.
```typescript
cyberbot.tone(PiezoPin.Pin22, 5000, 1000)
```
## Servos
The blocks in this section allow you to execute basic commands on the Cyber:bots servos which can be connected to pins P0-P19 but are typically attached to P16-P19.

Set the speed of the servo to full speed in the counterclockwise direction for 5 seconds, then full speed in the clockwise direction for 5 seconds, and finally stop moving completely.
```typescript
cyberbot.servoSpeed(ServoPin.Pin18, 75)
basic.pause(5000)
cyberbot.servoSpeed(ServoPin.Pin18, -75)
basic.pause(5000)
cyberbot.servoStop(ServoPin.Pin18)
```
Set the angle (0-180) of a parallax standard servo to 90
```typescript
cyberbot.servoAngle(ServoPin.Pin16, 90)
```

## Sensors
This section contains blocks that can be used to read values from additional available sensors used by the Cyber:bot.

Send a signal to the input pin which sends out an IR light at the desired frequency, it then waits for a signal to be received by the output pin which is then stored with a signal being detected storing a 0 and nothing being detected being a 1.
```typescript
let ir_state = cyberbot.irDetect(BotPin.Pin14, BotPin.Pin13, 37500)
```
Scan for a signal from an IR remote to be received and store the remote value in a variable.
```typescript
let ir_value = cyberbot.irRemote(BotPin.Pin13)
```
Send a signal to activate an ultrasonic ping signal to be sent out, it then waits for the signal to be received and records the time it took in microseconds, after that it converts it to the desired units (CM).
```typescript
let ir_value = cyberbot.ping(ServoPin.Pin16, Units.CM)
```
Starts reading the binary values returned by the QTI sensors stating if light is seen (0) or if there is no light (1), then compiling all the sensors' values together converting them into a single decimal value. Next, it takes the decimal value from qti_states and converts it back to binary, which is then shifted over to the desired bit location (3) and returns the binary value that was stored there.
```typescript
let qti_states = cyberbot.qtiRead(BotPin.Pin7, BotPin.Pin4)
let bit_value = cyberbot.bitGet(qti_states, 3)
```

## Extras
This extension also adds some blocks outside of the Cyber:bot category that allows you to better complete our tutorials as well as to help with other aspects of block coding.

### Dictionary & Radio
A new category that is added is the dictionary category which allows you to do some simple things such as create and edit a dictionary, convert a dictionary to a string and vice versa, and find specific elements of a dictionary.

Create a dictionary, add a new entry, change that entry, save the new changed entry in a separate variable, and then delete the new entry from the original dictionary.
```typescript
let dict = dictionary.createDictionary(
["key", "message"],
[22, "Hello"]
)
dict = dictionary.dictAdd(dict, "new", 70)
dict = dictionary.dictChange("seventy", "new", dict)
let store_val: number = dictionary.dictionarySearch(dict, "new")
dict = dictionary.dictRemove(dict, "new")
```
The radio category also has two new blocks that allow you to send and receive strings longer than normally allowed by Makecode.

Convert a dictionary to a string and send it to another Micro:bit.
```typescript
let package = dictionary.dictionaryToString(dict)
radio.sendLongString(package)
```
Wait for a signal to be received and then convert the received string into a dictionary.
```typescript
radio.onLongMessageReceived(function (rLongString) {
    dict = dictionary.stringToDictionary(rLongString)
})
```

### Basic & Loops
The basic category adds a block similar to the show arrow block that instead shows 12 separate clock hands and the loops category has a new range block in it that allows you to choose a start number, an end number, as well as a step size that can be added to the list part of the for element of loop.

Loops through all clock hands going counterclockwise continuously.
```typescript
basic.forever(function () {
    for (let time of loops.range(11, 0, -1)) {
        basic.showClock(time)
    }
})
```

### Text
All that's added for this category is an upper block that sets everything inside of it to uppercase and stores it in a variable.
```typescript
let uppercase = text.setToUpper("make this uppercase")
```

### Serial
This section has a serial new line block that's been added that lets you simply add a new line to the serial terminal.
```typescript
serial.NewLine()
```

## Supported targets
- for PXT/microbit

## License
MIT
