# Makecode Extension for the Cyber:bot Product
Use this Library to add blocks for the [Cyber:bot Robot Kit – with Micro:bit](https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/)

## Cyber:bot Makecode Tutorials
[Parallax Makecode Tutorials for the Cyber:bot](https://learn.parallax.com/tutorials/robot/cyberbot/makecode-blocks-cyberbot)

## Cyber:bot Blocks
The Cyber:bot extension adds two separate groups of blocks, that being the cyber:bot category and the extra blocks. The Cyber:bot blocks all directly control a part of the Cyber:bot that is either already part of the bot or is easily added using the boards built-in breadboard and our tutorials, these blocks are shown below.

### Basic Read Write
This section contains the blocks you will need to do basic reading and writing of any of the pins labeled P0-P22 on the Cyber:bot which are different than the ones used by the Micro:bit.

Write high or low to any of the pins.
```blocks
cyberbot.writeDigital(cyberbot.BotPin.P21, cyberbot.State.High)
cyberbot.writeDigital(cyberbot.BotPin.P21, cyberbot.State.Low)
```
Read from any of the pins and store the results in a variable.
```blocks
let pin_state = cyberbot.readDigital(cyberbot.BotPin.P21)
```
Compare the state of a pin and write an analog signal (in Hz) to a pin if the first pin is high.
```blocks
if (cyberbot.readDigitalBoole(cyberbot.BotPin.P8)) {
    cyberbot.writeAnalog(cyberbot.BotPin.P10, 5000)
}
```

### Sound
There are two blocks in this section that allow you to play a frequency intended for a piezo speaker through pins labeled P0-P15 and P22 on the Cyber:bot.

The first option allows you to choose a specific note on a piano from Low C (131 Hz) to High B (988 Hz), as well as how long you want it to play in beats.
```blocks
cyberbot.note(cyberbot.PiezoPin.P22, 262, music.beat(BeatFraction.Whole))
```
The second option allows you to choose a frequency in Hz (5000) and a duration in ms (1 second) that the speaker will play.
```blocks
cyberbot.tone(cyberbot.PiezoPin.P22, 5000, 1000)
```
### Servos
The blocks in this section allow you to execute basic commands on the Cyber:bots servos which can be connected to pins P0-P19 but are typically attached to P16-P19.

Set the speed of the servo to full speed in the counterclockwise direction for 5 seconds, then full speed in the clockwise direction for 5 seconds, and finally stop moving completely.
```blocks
cyberbot.servoSpeed(cyberbot.ServoPin.P18, 75)
basic.pause(5000)
cyberbot.servoSpeed(cyberbot.ServoPin.P18, -75)
basic.pause(5000)
cyberbot.servoStop(cyberbot.ServoPin.P18)
```
Set the angle (0-180) of a parallax standard servo to 90
```blocks
cyberbot.servoAngle(cyberbot.ServoPin.P16, 90)
```

### Sensors
This section contains blocks that can be used to read values from additional available sensors used by the Cyber:bot.

Send a signal to the input pin which sends out an IR light at the desired frequency, it then waits for a signal to be received by the output pin which is then stored with a signal being detected storing a 0 and nothing being detected being a 1.
```blocks
let ir_state = cyberbot.irDetect(cyberbot.BotPin.P14, cyberbot.BotPin.P13, 37500)
```
Scan for a signal from an IR remote to be received and store the remote value in a variable.
```blocks
let ir_value = cyberbot.irRemote(cyberbot.BotPin.P13)
```
Send a signal to activate an ultrasonic ping signal to be sent out, it then waits for the signal to be received and records the time it took in microseconds, after that it converts it to the desired units (CM).
```blocks
let ir_value = cyberbot.ping(cyberbot.ServoPin.P16, cyberbot.Units.CM)
```
This starts reading the binary values returned by the QTI sensors stating if light is seen (0) or if there is no light (1), then compiling all the sensors' values together converting them into a single decimal value. Next, it takes the decimal value from qti_states and converts it back to binary, which is then shifted over to the desired bit location (3) and returns the binary value that was stored there.
```blocks
let qti_states = cyberbot.qtiRead(cyberbot.BotPin.P7, cyberbot.BotPin.P4)
let bit_value = cyberbot.bitGet(qti_states, 3)
```

## Support Blocks
This extension also adds some blocks outside of the Cyber:bot category that allows you to better complete our tutorials as well as to help with other aspects of block coding.

### Dictionary & Radio
A new category that is added is the dictionary category which allows you to do some simple things such as create and edit a dictionary, convert a dictionary to a string and vice versa, and find specific elements of a dictionary.

Create a dictionary, add a new entry, save the new entry in a separate variable, and then delete the new entry from the original dictionary.
```blocks
let dict = cyberbot.createDictionary(
["key", "message"],
[22, "Hello"]
)
dict = cyberbot.dictAdd(dict, "new", 70)
let store_val: number = cyberbot.dictionarySearch(dict, "new")
dict = cyberbot.dictRemove(dict, "new")
```
The radio category also has two new blocks that allow you to send and receive strings longer than normally allowed by Makecode.

Convert a dictionary to a string and send it to another Micro:bit.
```blocks
let package = cyberbot.dictionaryToString(dict)
cyberbot.sendLongString(package)
```
Wait for a signal to be received and then convert the received string into a dictionary.
```blocks
radio.onLongMessageReceived(function (rLongString) {
    dict = cyberbot.stringToDictionary(rLongString)
})
```

### Basic & Loops
The basic category adds a block similar to the show arrow block that instead shows 12 separate clock hands and the loops category has a new range block in it that allows you to choose a start number, an end number, as well as a step size that can be added to the list part of the for element of loop.

Loops through all clock hands going counterclockwise continuously.
```blocks
basic.forever(function () {
    for (let time of cyberbot.range(11, 0, -1)) {
        cyberbot.showClock(time)
    }
})
```

### Text
All that's added for this category is an upper block that sets everything inside of it to uppercase and stores it in a variable.
```blocks
let uppercase = cyberbot.setToUpper("make this uppercase")
```

### Serial
This section has a serial new line block that's been added that lets you add a new line to the serial terminal.
```blocks
cyberbot.NewLine()
```

## Supported targets
- for PXT/microbit

## License
MIT
