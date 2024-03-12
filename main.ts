//% block="Color Sensor" block.loc.cs="Senzor Barev" color=#00B1ED  icon="\uf005"
namespace ColorSensor {
    export enum Mode {
        //% block="distance" block.loc.cs="vzdálenost"
        Distance,
        //% block="color" block.loc.cs="barvy"
        Color
    }
    export enum RGBC {
        //% block="red" block.loc.cs="červený"
        R,
        //% block="green" block.loc.cs="zelený"
        G,
        //% block="blue" block.loc.cs="modrý"
        B,
        //% block="clear" block.loc.cs="ALS"
        C
    }
    const ADDR = 0x39
    let tmp
    let currentMode: Mode
    export function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    export function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE)
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE)
        return val
    }
    //% block="initalize mode $mode"
    //% block.loc.cs="inicializovat mód $mode"
    //% weight=100
    export function init(mode: Mode): void {
        currentMode = mode
        switch (mode) {
            case Mode.Distance:
                i2cwrite(ADDR, 0x80, 0b0)
                i2cwrite(ADDR, 0x81, 0b11111100)
                i2cwrite(ADDR, 0x8F, 0b11001111)
                i2cwrite(ADDR, 0xAB, 0b0)
                i2cwrite(ADDR, 0xE7, 0b0)
                i2cwrite(ADDR, 0x80, 0b101)
            case Mode.Color:
                i2cwrite(ADDR, 0x80, 0b0)
                i2cwrite(ADDR, 0x81, 0b11111100)
                i2cwrite(ADDR, 0x8F, 0b11001111)
                i2cwrite(ADDR, 0xAB, 0b0)
                i2cwrite(ADDR, 0xE7, 0b0)
                i2cwrite(ADDR, 0x80, 0b11)
        }
    }
    //% block="distance (0~255)"
    //% block.loc.cs="vzdálenost (0~255)"
    //% weight=99
    export function distance(): number {
        if (currentMode == Mode.Distance) {
            tmp = i2cread(ADDR, 0x93) & 0b10;
            while (!tmp) {
                basic.pause(5);
                tmp = i2cread(ADDR, 0x93) & 0b10;
            }
            return i2cread(ADDR, 0x9C)
        } else {
            throw "mode is not `distance`"
        }
    }
    //% block="color $rgbc channel (0~4096)"
    //% block.loc.cs="barva $rgbc kanál (0~4096)"
    //% weight=99
    export function color(rgbc: RGBC): number {
        if (currentMode == Mode.Color) {
            tmp = i2cread(ADDR, 0x93) & 0b1;
            while (!tmp) {
                basic.pause(5);
                tmp = i2cread(ADDR, 0x93) & 0b1;
            }
            switch (rgbc) {
                case RGBC.R:
                    return i2cread(ADDR, 0x96) + i2cread(ADDR, 0x97) * 256
                case RGBC.G:
                    return i2cread(ADDR, 0x98) + i2cread(ADDR, 0x99) * 256
                case RGBC.B:
                    return i2cread(ADDR, 0x9A) + i2cread(ADDR, 0x9B) * 256
                case RGBC.C:
                    return i2cread(ADDR, 0x94) + i2cread(ADDR, 0x95) * 256
                default:
                    return 0
            }
        } else {
            throw "mode is not `color`"
        }
    }
}
