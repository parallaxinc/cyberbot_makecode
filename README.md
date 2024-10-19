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
//No clue what accelerate does so either remove or figure it out//
```typescript

```

Set the angle (0-180) of a parallax standard servo to 90
```typescript
cyberbot.servoAngle(ServoPin.Pin16, 90)
```

## Sensors
```typescript

```

## Other
```typescript

```

## Navigation
```typescript

```

## Extras
```typescript

```
