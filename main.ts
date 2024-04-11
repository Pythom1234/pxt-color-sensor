//% block="Color Sensor" block.loc.cs="Senzor Barev" color=#00B1EE  icon="\uf005"
namespace ColorSensor {
    export enum Mode {
        //% block="distance" block.loc.cs="vzdálenost"
        Distance,
        //% block="color" block.loc.cs="barvy"
        Color,
        //% block="gesture" block.loc.cs="gesta"
        Gesture
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
    export enum Gestures {
        //% block="right"
        //% block.loc.cs="doprava"
        Right = 1,
        //% block="left"
        //% block.loc.cs="doleva"
        Left = 2,
        //% block="up"
        //% block.loc.cs="nahoru"
        Up = 3,
        //% block="down"
        //% block.loc.cs="dolů"
        Down = 4,
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
            case Mode.Gesture:
                APDSGestures.init()
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
    //% weight=98
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
    //% block="on gesture %gesture"
    //% block.loc.cs="při gestu %gesture"
    //% weight=97
    export function onGesture(gesture: Gestures, body: () => void): void {
        if (gesture == Gestures.Right) control.onEvent(APDSGestures.gestureRightID, gesture, body);
        if (gesture == Gestures.Left) control.onEvent(APDSGestures.gestureLeftID, gesture, body);
        if (gesture == Gestures.Up) control.onEvent(APDSGestures.gestureUpID, gesture, body);
        if (gesture == Gestures.Down) control.onEvent(APDSGestures.gestureDownID, gesture, body);

        control.inBackground(() => {
            while (true) {
                if (currentMode == Mode.Gesture) {
                    const gesture = APDSGestures.read();

                    if (gesture != APDSGestures.lastGesture) {
                        APDSGestures.lastGesture = gesture;
                        switch (gesture) {
                            case 1:
                                control.raiseEvent(APDSGestures.gestureRightID, Gestures.Right);
                                break;
                            case 2:
                                control.raiseEvent(APDSGestures.gestureLeftID, Gestures.Left);
                                break;
                            case 3:
                                control.raiseEvent(APDSGestures.gestureUpID, Gestures.Up);
                                break;
                            case 4:
                                control.raiseEvent(APDSGestures.gestureDownID, Gestures.Down);
                                break;
                        }
                    }
                    basic.pause(50);
                } else {
                    throw "mode is not `gesture`"
                }
            }
        })
    }

    namespace APDSGestures {
        export const gestureRightID = 4101;
        export const gestureLeftID = 4102;
        export const gestureUpID = 4103;
        export const gestureDownID = 4104;
        export const gestureForwardID = 4105;
        export const gestureBackwardID = 4106;
        let DEBUG = 0;
        let APDS9960_I2C_ADDR = 0x39
        let GESTURE_THRESHOLD_OUT = 30
        let GESTURE_SENSITIVITY_1 = 33
        let GESTURE_SENSITIVITY_2 = 18
        let ERROR = 0xFF
        let APDS9960_ID_1 = 0xAB
        let APDS9960_ID_2 = 0x9C
        let FIFO_PAUSE_TIME = 30
        let APDS9960_ENABLE = 0x80
        let APDS9960_ATIME = 0x81
        let APDS9960_WTIME = 0x83
        let APDS9960_AILTL = 0x84
        let APDS9960_AILTH = 0x85
        let APDS9960_AIHTL = 0x86
        let APDS9960_AIHTH = 0x87
        let APDS9960_PILT = 0x89
        let APDS9960_PIHT = 0x8B
        let APDS9960_PERS = 0x8C
        let APDS9960_CONFIG1 = 0x8D
        let APDS9960_PPULSE = 0x8E
        let APDS9960_CONTROL = 0x8F
        let APDS9960_CONFIG2 = 0x90
        let APDS9960_ID = 0x92
        let APDS9960_STATUS = 0x93
        let APDS9960_CDATAL = 0x94
        let APDS9960_CDATAH = 0x95
        let APDS9960_RDATAL = 0x96
        let APDS9960_RDATAH = 0x97
        let APDS9960_GDATAL = 0x98
        let APDS9960_GDATAH = 0x99
        let APDS9960_BDATAL = 0x9A
        let APDS9960_BDATAH = 0x9B
        let APDS9960_PDATA = 0x9C
        let APDS9960_POFFSET_UR = 0x9D
        let APDS9960_POFFSET_DL = 0x9E
        let APDS9960_CONFIG3 = 0x9F
        let APDS9960_GPENTH = 0xA0
        let APDS9960_GEXTH = 0xA1
        let APDS9960_GCONF1 = 0xA2
        let APDS9960_GCONF2 = 0xA3
        let APDS9960_GOFFSET_U = 0xA4
        let APDS9960_GOFFSET_D = 0xA5
        let APDS9960_GOFFSET_L = 0xA7
        let APDS9960_GOFFSET_R = 0xA9
        let APDS9960_GPULSE = 0xA6
        let APDS9960_GCONF3 = 0xAA
        let APDS9960_GCONF4 = 0xAB
        let APDS9960_GFLVL = 0xAE
        let APDS9960_GSTATUS = 0xAF
        let APDS9960_IFORCE = 0xE4
        let APDS9960_PICLEAR = 0xE5
        let APDS9960_CICLEAR = 0xE6
        let APDS9960_AICLEAR = 0xE7
        let APDS9960_GFIFO_U = 0xFC
        let APDS9960_GFIFO_D = 0xFD
        let APDS9960_GFIFO_L = 0xFE
        let APDS9960_GFIFO_R = 0xFF
        let APDS9960_PON = 0b00000001
        let APDS9960_AEN = 0b00000010
        let APDS9960_PEN = 0b00000100
        let APDS9960_WEN = 0b00001000
        let APSD9960_AIEN = 0b00010000
        let APDS9960_PIEN = 0b00100000
        let APDS9960_GEN = 0b01000000
        let APDS9960_GVALID = 0b00000001
        let OFF = 0
        let ON = 1
        let POWER = 0
        let AMBIENT_LIGHT = 1
        let PROXIMITY = 2
        let WAIT = 3
        let AMBIENT_LIGHT_INT = 4
        let PROXIMITY_INT = 5
        let GESTURE = 6
        let ALL = 7
        let LED_DRIVE_100MA = 0
        let LED_DRIVE_50MA = 1
        let LED_DRIVE_25MA = 2
        let LED_DRIVE_12_5MA = 3
        let PGAIN_1X = 0
        let PGAIN_2X = 1
        let PGAIN_4X = 2
        let PGAIN_8X = 3
        let AGAIN_1X = 0
        let AGAIN_4X = 1
        let AGAIN_16X = 2
        let AGAIN_64X = 3
        let GGAIN_1X = 0
        let GGAIN_2X = 1
        let GGAIN_4X = 2
        let GGAIN_8X = 3
        let LED_BOOST_100 = 0
        let LED_BOOST_150 = 1
        let LED_BOOST_200 = 2
        let LED_BOOST_300 = 3
        let GWTIME_0MS = 0
        let GWTIME_2_8MS = 1
        let GWTIME_5_6MS = 2
        let GWTIME_8_4MS = 3
        let GWTIME_14_0MS = 4
        let GWTIME_22_4MS = 5
        let GWTIME_30_8MS = 6
        let GWTIME_39_2MS = 7
        let DEFAULT_ATIME = 219
        let DEFAULT_WTIME = 246
        let DEFAULT_PROX_PPULSE = 0x87
        let DEFAULT_GESTURE_PPULSE = 0x89
        let DEFAULT_POFFSET_UR = 0
        let DEFAULT_POFFSET_DL = 0
        let DEFAULT_CONFIG1 = 0x60
        let DEFAULT_LDRIVE = LED_DRIVE_100MA
        let DEFAULT_PGAIN = PGAIN_4X
        let DEFAULT_AGAIN = AGAIN_4X
        let DEFAULT_PILT = 0
        let DEFAULT_PIHT = 50
        let DEFAULT_AILT = 0xFFFF
        let DEFAULT_AIHT = 0
        let DEFAULT_PERS = 0x11
        let DEFAULT_CONFIG2 = 0x01
        let DEFAULT_CONFIG3 = 0
        let DEFAULT_GPENTH = 40
        let DEFAULT_GEXTH = 30
        let DEFAULT_GCONF1 = 0x40
        let DEFAULT_GGAIN = GGAIN_4X
        let DEFAULT_GLDRIVE = LED_DRIVE_100MA
        let DEFAULT_GWTIME = GWTIME_2_8MS
        let DEFAULT_GOFFSET = 0
        let DEFAULT_GPULSE = 0xC9
        let DEFAULT_GCONF3 = 0
        let DEFAULT_GIEN = 0
        enum DIR {
            DIR_NONE,
            DIR_RIGHT,
            DIR_LEFT,
            DIR_UP,
            DIR_DOWN,
            DIR_NEAR,
            DIR_FAR,
            DIR_ALL
        }
        enum STATE {
            NA_STATE,
            NEAR_STATE,
            FAR_STATE,
            ALL_STATE
        }
        let gesture_ud_delta: number;
        let gesture_lr_delta: number;
        let gesture_ud_count: number;
        let gesture_lr_count: number;
        let gesture_near_count: number;
        let gesture_far_count: number;
        let gesture_state: number;
        let gesture_motion: number;

        const gestureEventId = 3100;
        export let lastGesture = 0;


        export class gesture_data_type {
            u_data: Buffer;
            d_data: Buffer;
            l_data: Buffer;
            r_data: Buffer;
            index: number;
            total_gestures: number;
            in_threshold: number;
            out_threshold: number;
        }

        let gesture_data = new gesture_data_type;
        let data_buf: Buffer = pins.createBuffer(128);


        function APDS9960ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);
            buf[0] = addr;
            pins.i2cWriteBuffer(0x39, buf, false);
            buf = pins.i2cReadBuffer(0x39, 1, false);
            return buf[0];
        }

        function APDS9960WriteReg(addr: number, cmd: number) {
            let buf: Buffer = pins.createBuffer(2);

            buf[0] = addr;
            buf[1] = cmd;

            pins.i2cWriteBuffer(0x39, buf, false);
        }


        function APDS9960ReadRegBlock(addr: number, len: number): number {
            let i: number = 0;
            let y: number = 0;

            for (let i = 0; i < len; i = i + 4) {

                data_buf[i] = readi2c(0xFc);
                data_buf[i + 1] = readi2c(0xFd);
                data_buf[i + 2] = readi2c(0xFe);
                data_buf[i + 3] = readi2c(0xFf);
                basic.pause(10);
                if (DEBUG) {
                    serial.writeLine(data_buf[i].toString() + " ; "
                        + data_buf[i + 1].toString() + " ; "
                        + data_buf[i + 2].toString() + " ; "
                        + data_buf[i + 3].toString() + " ; ");
                }
            }


            return len;
        }

        function getMode(): number {
            let enable_value: number;

            enable_value = APDS9960ReadReg(APDS9960_ENABLE);
            return enable_value;
        }

        function setMode(mode: number, enable: number) {
            let reg_val: number;
            reg_val = getMode();
            enable = enable & 0x01;
            if (mode >= 0 && mode <= 6) {
                if (enable) {
                    reg_val |= (1 << mode);
                } else {
                    reg_val = 0x00;
                }
            } else if (mode == ALL) {
                if (enable) {
                    reg_val = 0x7F;
                } else {
                    reg_val = 0x00;
                }
            }

            APDS9960WriteReg(APDS9960_ENABLE, reg_val);
        }

        function setGestureGain(gain: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GCONF2);

            gain &= 0b00000011;
            gain = gain << 5;
            val &= 0b10011111;
            val |= gain;

            APDS9960WriteReg(APDS9960_GCONF2, val);
        }

        function setGestureLEDDrive(drive: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GCONF2);

            drive &= 0b00000011;
            drive = drive << 3;
            val &= 0b11100111;
            val |= drive;

            APDS9960WriteReg(APDS9960_GCONF2, val);
        }

        function setLEDBoost(boost: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_CONFIG2);

            boost &= 0b00000011;
            boost = boost << 4;
            val &= 0b11001111;
            val |= boost;

            APDS9960WriteReg(APDS9960_CONFIG2, val);
        }

        function setGestureWaitTime(time: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GCONF2);

            time &= 0b00000111;
            val &= 0b11111000;
            val |= time;

            APDS9960WriteReg(APDS9960_GCONF2, val);
        }

        function setGestureIntEnable(enable: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GCONF4);

            enable &= 0b00000001;
            enable = enable << 1;
            val &= 0b11111101;
            val |= enable;

            APDS9960WriteReg(APDS9960_GCONF4, val);
        }

        function resetGestureParameters() {
            gesture_data.index = 0;
            gesture_data.total_gestures = 0;

            gesture_ud_delta = 0;
            gesture_lr_delta = 0;

            gesture_ud_count = 0;
            gesture_lr_count = 0;

            gesture_near_count = 0;
            gesture_far_count = 0;

            gesture_state = 0;
            gesture_motion = DIR.DIR_NONE;
        }

        function setGestureMode(mode: number) {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GCONF4);

            mode &= 0b00000001;
            val &= 0b11111110;
            val |= mode;

            APDS9960WriteReg(APDS9960_GCONF4, val);
        }

        function enablePower() {
            setMode(POWER, 1);
        }

        function enableGestureSensor(interrupts: boolean) {
            resetGestureParameters();
            APDS9960WriteReg(APDS9960_WTIME, 0xFF);
            APDS9960WriteReg(APDS9960_PPULSE, DEFAULT_GESTURE_PPULSE);
            setLEDBoost(LED_BOOST_300);
            if (interrupts) {
                setGestureIntEnable(1);
            } else {
                setGestureIntEnable(0);
            }
            setGestureMode(1);
            enablePower();
            setMode(WAIT, 1)
            setMode(PROXIMITY, 1);
            setMode(GESTURE, 1);
        }

        function pads9960_init() {
            let aa = APDS9960ReadReg(0X92);
            if (aa == 0xAB) {
                APDS9960WriteReg(APDS9960_GPENTH, DEFAULT_GPENTH);
                APDS9960WriteReg(APDS9960_GEXTH, DEFAULT_GEXTH);
                APDS9960WriteReg(APDS9960_GCONF1, DEFAULT_GCONF1);
                setGestureGain(DEFAULT_GGAIN);
                setGestureLEDDrive(DEFAULT_GLDRIVE);
                setGestureWaitTime(DEFAULT_GWTIME);
                APDS9960WriteReg(APDS9960_GOFFSET_U, DEFAULT_GOFFSET);
                APDS9960WriteReg(APDS9960_GOFFSET_D, DEFAULT_GOFFSET);
                APDS9960WriteReg(APDS9960_GOFFSET_L, DEFAULT_GOFFSET);
                APDS9960WriteReg(APDS9960_GOFFSET_R, DEFAULT_GOFFSET);
                APDS9960WriteReg(APDS9960_GPULSE, DEFAULT_GPULSE);
                APDS9960WriteReg(APDS9960_GCONF3, DEFAULT_GCONF3);
                setGestureIntEnable(DEFAULT_GIEN);
            }

        }

        function isGestureAvailable(): boolean {
            let val: number;

            val = APDS9960ReadReg(APDS9960_GSTATUS);
            val &= APDS9960_GVALID;

            if (val == 1) {
                return true;
            } else {
                return false;
            }
        }

        function processGestureData(): boolean {
            let u_first: number = 0;
            let d_first: number = 0;
            let l_first: number = 0;
            let r_first: number = 0;
            let u_last: number = 0;
            let d_last: number = 0;
            let l_last: number = 0;
            let r_last: number = 0;
            let ud_ratio_first: number;
            let lr_ratio_first: number;
            let ud_ratio_last: number;
            let lr_ratio_last: number;
            let ud_delta: number;
            let lr_delta: number;
            let i: number;

            if (gesture_data.total_gestures <= 4) {
                return false;
            }

            if ((gesture_data.total_gestures <= 32) && (gesture_data.total_gestures > 0)) {

                for (i = 0; i < gesture_data.total_gestures; i++) {
                    if ((gesture_data.u_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[i] > GESTURE_THRESHOLD_OUT)) {

                        u_first = gesture_data.u_data[i];
                        d_first = gesture_data.d_data[i];
                        l_first = gesture_data.l_data[i];
                        r_first = gesture_data.r_data[i];
                        break;
                    }
                }

                if ((u_first == 0) || (d_first == 0) || (l_first == 0) || (r_first == 0)) {

                    return false;
                }
                for (i = gesture_data.total_gestures - 1; i >= 0; i--) {


                    if ((gesture_data.u_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[i] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[i] > GESTURE_THRESHOLD_OUT)) {

                        u_last = gesture_data.u_data[i];
                        d_last = gesture_data.d_data[i];
                        l_last = gesture_data.l_data[i];
                        r_last = gesture_data.r_data[i];
                        break;
                    }
                }
            }

            ud_ratio_first = ((u_first - d_first) * 100) / (u_first + d_first);
            lr_ratio_first = ((l_first - r_first) * 100) / (l_first + r_first);
            ud_ratio_last = ((u_last - d_last) * 100) / (u_last + d_last);
            lr_ratio_last = ((l_last - r_last) * 100) / (l_last + r_last);
            ud_delta = ud_ratio_last - ud_ratio_first;
            lr_delta = lr_ratio_last - lr_ratio_first;
            gesture_ud_delta += ud_delta;
            gesture_lr_delta += lr_delta;
            if (gesture_ud_delta >= GESTURE_SENSITIVITY_1) {
                gesture_ud_count = 1;
            } else if (gesture_ud_delta <= -GESTURE_SENSITIVITY_1) {
                gesture_ud_count = -1;
            } else {
                gesture_ud_count = 0;
            }

            if (gesture_lr_delta >= GESTURE_SENSITIVITY_1) {
                gesture_lr_count = 1;
            } else if (gesture_lr_delta <= -GESTURE_SENSITIVITY_1) {
                gesture_lr_count = -1;
            } else {
                gesture_lr_count = 0;
            }

            if ((gesture_ud_count == 0) && (gesture_lr_count == 0)) {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {

                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        gesture_near_count++;
                    } else if ((ud_delta != 0) || (lr_delta != 0)) {
                        gesture_far_count++;
                    }

                    if ((gesture_near_count >= 10) && (gesture_far_count >= 2)) {
                        if ((ud_delta == 0) && (lr_delta == 0)) {
                            gesture_state = STATE.NEAR_STATE;
                        } else if ((ud_delta != 0) && (lr_delta != 0)) {
                            gesture_state = STATE.FAR_STATE;
                        }
                        return true;
                    }
                }
            } else {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {

                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        gesture_near_count++;
                    }

                    if (gesture_near_count >= 10) {
                        gesture_ud_count = 0;
                        gesture_lr_count = 0;
                        gesture_ud_delta = 0;
                        gesture_lr_delta = 0;
                    }
                }
            }
            return true;
        }

        function decodeGesture(): boolean {
            if (gesture_state == STATE.NEAR_STATE) {
                gesture_motion = DIR.DIR_NEAR;
                return true;
            } else if (gesture_state == STATE.FAR_STATE) {
                gesture_motion = DIR.DIR_FAR;
                return true;
            }

            if ((gesture_ud_count == -1) && (gesture_lr_count == 0)) {
                gesture_motion = DIR.DIR_UP;
            } else if ((gesture_ud_count == 1) && (gesture_lr_count == 0)) {
                gesture_motion = DIR.DIR_DOWN;
            } else if ((gesture_ud_count == 0) && (gesture_lr_count == 1)) {
                gesture_motion = DIR.DIR_RIGHT;
            } else if ((gesture_ud_count == 0) && (gesture_lr_count == -1)) {
                gesture_motion = DIR.DIR_LEFT;
            } else if ((gesture_ud_count == -1) && (gesture_lr_count == 1)) {
                if (Math.abs(gesture_ud_delta) > Math.abs(gesture_lr_delta)) {
                    gesture_motion = DIR.DIR_UP;
                } else {
                    gesture_motion = DIR.DIR_RIGHT;
                }
            } else if ((gesture_ud_count == 1) && (gesture_lr_count == -1)) {
                if (Math.abs(gesture_ud_delta) > Math.abs(gesture_lr_delta)) {
                    gesture_motion = DIR.DIR_DOWN;
                } else {
                    gesture_motion = DIR.DIR_LEFT;
                }
            } else if ((gesture_ud_count == -1) && (gesture_lr_count == -1)) {
                if (Math.abs(gesture_ud_delta) > Math.abs(gesture_lr_delta)) {
                    gesture_motion = DIR.DIR_UP;
                } else {
                    gesture_motion = DIR.DIR_LEFT;
                }
            } else if ((gesture_ud_count == 1) && (gesture_lr_count == 1)) {
                if (Math.abs(gesture_ud_delta) > Math.abs(gesture_lr_delta)) {
                    gesture_motion = DIR.DIR_DOWN;
                } else {
                    gesture_motion = DIR.DIR_RIGHT;
                }
            } else {
                return false;
            }

            return true;
        }

        function readGesture(): number {
            let fifo_level: number = 0;
            let bytes_read: number = 0;
            let fifo_data: number[] = [];
            let gstatus: number;
            let motion: number;
            let i: number;
            gesture_data.d_data = pins.createBuffer(32);
            gesture_data.u_data = pins.createBuffer(32);
            gesture_data.l_data = pins.createBuffer(32);
            gesture_data.r_data = pins.createBuffer(32);
            if (!isGestureAvailable() || !(getMode() & 0b01000001)) {
                return DIR.DIR_NONE;
            }

            while (1) {
                basic.pause(30);
                gstatus = APDS9960ReadReg(APDS9960_GSTATUS);
                if ((gstatus & APDS9960_GVALID) == APDS9960_GVALID) {
                    fifo_level = APDS9960ReadReg(APDS9960_GFLVL);

                    if (fifo_level > 0) {
                        bytes_read = APDS9960ReadRegBlock(APDS9960_GFIFO_U,
                            (fifo_level * 4));

                        for (let i = 0; i < bytes_read; i++) {
                            fifo_data[i] = data_buf[i];
                        }

                        if (bytes_read >= 4) {
                            for (let ii = 0; ii < bytes_read; ii = ii + 4) {
                                gesture_data.u_data[gesture_data.index] = fifo_data[ii + 0];
                                gesture_data.d_data[gesture_data.index] = fifo_data[ii + 1];
                                gesture_data.l_data[gesture_data.index] = fifo_data[ii + 2];
                                gesture_data.r_data[gesture_data.index] = fifo_data[ii + 3];
                                gesture_data.index++;
                                gesture_data.total_gestures++;
                            }

                            if (0) {
                                serial.writeLine("Up Data: ");
                                for (i = 0; i < gesture_data.total_gestures; i++) {
                                    serial.writeLine(gesture_data.u_data[i].toString());
                                }
                                serial.writeLine("Up END");
                            }

                            if (processGestureData()) {
                                if (decodeGesture()) {
                                    motion = gesture_motion;
                                    resetGestureParameters();
                                    return motion;
                                }
                            }
                            gesture_data.index = 0;
                            gesture_data.total_gestures = 0;
                        }

                    }

                }
                else {
                    basic.pause(30);
                    decodeGesture();
                    motion = gesture_motion;
                    resetGestureParameters();
                    return motion;
                }

            }

            motion = gesture_motion;
            return motion;
        }

        export function init() {
            pads9960_init();
            enableGestureSensor(false);
            if (0) {
                let reg: number = 0x00;
                let val: number = 0x00;

                for (reg = 0x80; reg <= 0xAF; reg++) {
                    if ((reg != 0x82) &&
                        (reg != 0x8A) &&
                        (reg != 0x91) &&
                        (reg != 0xA8) &&
                        (reg != 0xAC) &&
                        (reg != 0xAD)) {
                        val = APDS9960ReadReg(reg);
                    }
                }

                for (reg = 0xE4; reg <= 0xE7; reg++) {
                    val = APDS9960ReadReg(reg);
                }

            }
        }


        export function read(): number {
            let data = 0, result = 0;

            switch (readGesture()) {

                case DIR.DIR_UP:
                    result = Gestures.Up;
                    break;
                case DIR.DIR_DOWN:
                    result = Gestures.Down;
                    break;
                case DIR.DIR_LEFT:
                    result = Gestures.Left;
                    break;
                case DIR.DIR_RIGHT:
                    result = Gestures.Right;
                    break;
                default:

            }
            return result;
        }


        function readi2c(addr: number): number {

            return APDS9960ReadReg(addr);

        }

    }
}































