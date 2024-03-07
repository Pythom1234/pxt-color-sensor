//% block="Color Sensor" block.loc.cs="Senzor Barev" color=#00B1ED  icon="\uf005"
namespace ColorSensor {
    const ADDR = 0x39;
    const ENABLE_PON = 0x80; // Power ON
    const ENABLE_PEN = 0x04; // Proximity Enable
    const ENABLE_PIEN = 0x20; // Proximity Interrupt Enable
    const ENABLE_GEN = 0x40; // Gesture Enable
    const ENABLE_AEN = 0x02; // ALS Enable
    const ENABLE_AIEN = 0x10; // ALS Interrupt Enable
    const ENABLE_WEN = 0x08; // Wait Enable
    const CONTROL_PGAIN = 0x8F; // Proximity Gain Control
    const CONTROL_LDRIVE = 0xC0; // LED Drive Strength
    const CONTROL_AGAIN = 0x03; // ALS Gain Control
    const CONFIG1_LOWPOW = 0x8D; // Low Power Clock Mode
    const CONFIG1_WLONG = 0x02; // Wait Long Enable
    const CONFIG2_CPSIEN = 0x90; // Clear diode Saturation Interrupt Enable
    const CONFIG2_PSIEN = 0x90; // Proximity Saturation Interrupt Enable
    const CONFIG2_LEDBOOST = 0x90; // Proximity/Gesture LED Boost
    const CONFIG3_PCMP = 0x9F; // Proximity Gain Compensation Enable
    const CONFIG3_PMSK_U = 0x9F; // Proximity Mask UP Enable
    const CONFIG3_PMSK_D = 0x9F; // Proximity Mask DOWN Enable
    const CONFIG3_PMSK_L = 0x9F; // Proximity Mask LEFT Enable
    const CONFIG3_PMSK_R = 0x9F; // Proximity Mask RIGHT Enable
    const STATUS_PGSAT = 0x93; // Proximity Saturation
    const STATUS_PINT = 0x93; // Proximity Interrupt
    const STATUS_PVALID = 0x93; // Proximity Valid
    const STATUS_CPSAT = 0x93; // Clear Diode Saturation
    const STATUS_AINT = 0x93; // ALS Interrupt
    const STATUS_AVALID = 0x93; // ALS Valid
    const STATUS_GSAT = 0x93; // Gesture Saturation
    const PDATA = 0x9C; // Proximity Data
    const PERS_APERS = 0x8C; // ALS Interrupt Persistence
    const PERS_PPERS = 0x8C; // Proximity Interrupt Persistence
    const POFFSET_UR = 0x9D; // Proximity Offset UP/RIGHT
    const POFFSET_DL = 0x9E; // Proximity Offset DOWN/LEFT
    const PILT = 0x89; // Proximity low threshold
    const PIHT = 0x8B; // Proximity high threshold
    const PPULSE_PPLEN = 0x8E; // Proximity Pulse Length
    const PPULSE_PPULSE = 0x8E; // Proximity Pulse Count
    const ATIME = 0x81; // ALS ADC Integration Time
    const WTIME = 0x83; // Wait Time
    const AILTL = 0x84; // ALS low threshold, lower byte
    const AILTH = 0x85; // ALS low threshold, upper byte
    const AIHTL = 0x86; // ALS high threshold, lower byte
    const AIHTH = 0x87; // ALS high threshold, upper byte
    const CDATAL = 0x94; // Clear Data, Low byte
    const CDATAH = 0x95; // Clear Data, High byte
    const RDATAL = 0x96; // Red Data, Low byte
    const RDATAH = 0x97; // Red Data, High byte
    const GDATAL = 0x98; // Green Data, Low byte
    const GDATAH = 0x99; // Green Data, High byte
    const BDATAL = 0x9A; // Blue Data, Low byte
    const BDATAH = 0x9B; // Blue Data, High byte
    const CICLEAR = 0xE5; // Clear Channel Interrupt Clear
    const PICLEAR = 0xE5; // Proximity Interrupt Clear
    const AICLEAR = 0xE7; // All Non-Gesture Interrupt Clear
    const GPENTH = 0xA0; // Gesture Proximity Entry Threshold
    const GEXTH = 0xA1; // Gesture Exit Threshold
    const GPULSE_GPULSE = 0xA6; // Gesture Pulse Count
    const GPULSE_GPLEN = 0xA6; // Gesture Pulse Length
    const GFLVL = 0xAE; // Gesture FIFO Level
    const GSTATUS_GFOV = 0xAF; // Gesture FIFO Overflow
    const GSTATUS_GVALID = 0xAF; // Gesture Valid
    const GCONFIG1_GFIFOTH = 0xA2; // Gesture FIFO Threshold
    const GCONFIG1_GEXMSK = 0xA2; // Gesture Exit Mask
    const GCONFIG1_GEXPERS = 0xA2; // Gesture Exit Persistence
    const GCONFIG2_GGAIN = 0xA3; // Gesture Gain Control
    const GCONFIG2_GLDRIVE = 0xA3; // Gesture LED Drive Strength
    const GCONFIG2_GWTIME = 0xA3; // Gesture Wait Time
    const GCONFIG3_GDIMS = 0xAA; // Gesture Dimension Select
    const GCONFIG4_GFIFO_CLR = 0xAB; // Gesture FIFO Clear
    const GCONFIG4_GIEN = 0xAB; // Gesture Interrupt Enable
    const GCONFIG4_GMODE = 0xAB; // Gesture Mode
    const GFIFO_U = 0xFC; // Gesture FIFO Data, UP
    const GFIFO_D = 0xFD; // Gesture FIFO Data, DOWN
    const GFIFO_L = 0xFE; // Gesture FIFO Data, LEFT
    const GFIFO_R = 0xFF; // Gesture FIFO Data, RIGHT
    const GOFFSET_U = 0xA4; // Gesture Offset, UP
    const GOFFSET_D = 0xA5; // Gesture Offset, DOWN
    const GOFFSET_L = 0xA7; // Gesture Offset, LEFT
    const GOFFSET_R = 0xA9; // Gesture Offset, RIGHT
}



















































// block="Color Sensor" block.loc.cs="Senzor Barev" color=#00B1ED  icon="\uf005"
namespace ColorSensorOld {
    const APDS9960_ADDR = 0x39
    const APDS9960_ENABLE = 0x80
    const APDS9960_ATIME = 0x81
    const APDS9960_CONTROL = 0x8F
    const APDS9960_STATUS = 0x93
    const APDS9960_CDATAL = 0x94
    const APDS9960_CDATAH = 0x95
    const APDS9960_RDATAL = 0x96
    const APDS9960_RDATAH = 0x97
    const APDS9960_GDATAL = 0x98
    const APDS9960_GDATAH = 0x99
    const APDS9960_BDATAL = 0x9A
    const APDS9960_BDATAH = 0x9B
    const APDS9960_GCONF4 = 0xAB
    const APDS9960_AICLEAR = 0xE7
    let color_first_init = false
    function i2cwrite_color(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2cread_color(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    function rgb2hsl(color_r: number, color_g: number, color_b: number): number {
        let Hue = 0
        let R = color_r * 100 / 255;
        let G = color_g * 100 / 255;
        let B = color_b * 100 / 255;
        let maxVal = Math.max(R, Math.max(G, B))
        let minVal = Math.min(R, Math.min(G, B))
        let Delta = maxVal - minVal;
        if (Delta < 0) {
            Hue = 0;
        }
        else if (maxVal == R && G >= B) {
            Hue = (60 * ((G - B) * 100 / Delta)) / 100;
        }
        else if (maxVal == R && G < B) {
            Hue = (60 * ((G - B) * 100 / Delta) + 360 * 100) / 100;
        }
        else if (maxVal == G) {
            Hue = (60 * ((B - R) * 100 / Delta) + 120 * 100) / 100;
        }
        else if (maxVal == B) {
            Hue = (60 * ((R - G) * 100 / Delta) + 240 * 100) / 100;
        }
        return Hue
    }
    function initModule(): void {
        i2cwrite_color(APDS9960_ADDR, APDS9960_ATIME, 252)
        i2cwrite_color(APDS9960_ADDR, APDS9960_CONTROL, 0x03)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_GCONF4, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_AICLEAR, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x01)
        color_first_init = true
    }
    function colorMode(): void {
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_ENABLE) | 0x2;
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, tmp);
    }
    export enum ColorList {
        //% block="Red"
        red,
        //% block="Green"
        green,
        //% block="Blue"
        blue,
        //% block="Cyan"
        cyan,
        //% block="Magenta"
        magenta,
        //% block="Yellow"
        yellow,
        //% block="White"
        white
    }
    export enum RGB {
        //% block="R"
        R,
        //% block="G"
        G,
        //% block="B"
        B
    }
    //% block="Color sensor HUE(0~360)"
    export function readColor(): number {
        if (color_first_init == false) {
            initModule()
            colorMode()
        }
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        }
        let c = i2cread_color(APDS9960_ADDR, APDS9960_CDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_CDATAH) * 256;
        let r = i2cread_color(APDS9960_ADDR, APDS9960_RDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_RDATAH) * 256;
        let g = i2cread_color(APDS9960_ADDR, APDS9960_GDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_GDATAH) * 256;
        let b = i2cread_color(APDS9960_ADDR, APDS9960_BDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_BDATAH) * 256;
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        let hue = rgb2hsl(r, g, b)
        return hue
    }
    //% block="Color sensor detects %color"
    export function checkColor(color: ColorList): boolean {
        let hue = readColor()
        switch (color) {
            case ColorList.red:
                if (hue > 330 || hue < 20) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.green:
                if (hue > 120 && 180 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.blue:
                if (hue > 210 && 270 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.cyan:
                if (hue > 190 && 210 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.magenta:
                if (hue > 260 && 330 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.yellow:
                if (hue > 30 && 120 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.white:
                if (hue >= 180 && 190 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
        }
    }
    //% block="Color sensor %rgb (0~255)"
    export function readColorRGB(rgb: RGB): number {
        if (color_first_init == false) {
            initModule()
            colorMode()
        }
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
        }
        let c = /*i2cread_color(APDS9960_ADDR, APDS9960_CDATAL) + */i2cread_color(APDS9960_ADDR, APDS9960_CDATAH) * 256;
        let r = /*i2cread_color(APDS9960_ADDR, APDS9960_RDATAL) + */i2cread_color(APDS9960_ADDR, APDS9960_RDATAH) * 256;
        let g = /*i2cread_color(APDS9960_ADDR, APDS9960_GDATAL) + */i2cread_color(APDS9960_ADDR, APDS9960_GDATAH) * 256;
        let b = /*i2cread_color(APDS9960_ADDR, APDS9960_BDATAL) + */i2cread_color(APDS9960_ADDR, APDS9960_BDATAH) * 256;
        /*let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;*/
        switch (rgb) {
            case RGB.R:
                return r
            case RGB.G:
                return g
            case RGB.B:
                return b
        }
    }
}
