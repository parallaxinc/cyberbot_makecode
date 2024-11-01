// If Pin21 is low change it to high play a sound, else if Pin21 is high change it to low, then display the state and wait for 5 seconds then repeat.
basic.forever(function () {
    if (cyberbot.readDigitalBoole(cyberbot.BotPin.P21)) {
        cyberbot.writeDigital(cyberbot.BotPin.P21, cyberbot.State.Low)
    } else if (!(cyberbot.readDigitalBoole(cyberbot.BotPin.P21))) {
        cyberbot.writeDigital(cyberbot.BotPin.P21, cyberbot.State.High)
    }
    basic.showNumber(cyberbot.readDigital(cyberbot.BotPin.P21))
    basic.pause(5000)
})

// Press A to make the cyberbot go full speed forward, Press B for it to stop moving
input.onButtonPressed(Button.A, function () {
    cyberbot.servoSpeed(cyberbot.ServoPin.P18, 75)
    cyberbot.servoSpeed(cyberbot.ServoPin.P19, -75)
})
input.onButtonPressed(Button.B, function () {
    cyberbot.servoStop(cyberbot.ServoPin.P18)
    cyberbot.servoStop(cyberbot.ServoPin.P19)
})

// Read Pins 7-4 and store there binary states in a single value, then check the binary state or each bit starting at bit 3 and ending at bit 0, then store it in a variable and scroll the states across the display
let qti = 0
let bits = ""
basic.forever(function () {
    qti = cyberbot.qtiRead(cyberbot.BotPin.P7, cyberbot.BotPin.P4)
    bits = ""
    for (let value of cyberbot.range(3, 0, -1)) {
        bits = "" + bits + convertToText(cyberbot.bitGet(qti, value))
    }
    basic.showString(bits)
})

// Create a dictionary, add a new key value pair, save the value from it and display it while waiting 5 seconds, then remove the pair, make the dictionary a string, and send it to another microbit using the long string send
let dict = cyberbot.createDictionary(
    ["one", "two"],
    [1, 2]
)
dict = cyberbot.dictAdd(dict, "three", 3)
let value: number = cyberbot.dictionarySearch(dict, "three")
basic.showNumber(value)
basic.pause(5000)
dict = cyberbot.dictRemove(dict, "three")
let _package = cyberbot.dictionaryToString(dict)
cyberbot.sendLongString(_package)


// Read the received long signal, change it to a dictionary, save the values from the dict in separate variables, display each input that was received for 5 seconds
let dict: { [key: string]: any; } = null
let one = 0
let two = 0
cyberbot.onLongMessageReceived(function (rLongString) {
    let item = 0
    dict = cyberbot.stringToDictionary(rLongString)
    one = cyberbot.dictionarySearch(item, "one")
    basic.showNumber(one)
    basic.pause(5000)
    two = cyberbot.dictionarySearch(item, "two")
    basic.showNumber(two)
    basic.pause(5000)
})

// Display a request for an input of your favorite animal on a terminal, wait for the input to be received with a carriage return, enter a new line on the serial, set everything entered to complete upper case, display the inputed string on the same terminal showing it is all upper case.
serial.writeString("What's your favorite animal:")
let str = cyberbot.setToUpper(serial.readUntil(serial.delimiters(Delimiters.CarriageReturn)))
cyberbot.newLine()
serial.writeLine("Your favorite animal is " + str)
