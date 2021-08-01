import { uint32 } from './utils'

class DanmakuSender {

  static CRCPOLYNOMIAL = 0xEDB88320;
  static crctable = new Array(256)

  constructor() {
    DanmakuSender.createTable()
  }

  static createTable() {
    for (let i = 0; i < 256; i++) {
      let crcreg = uint32(i);

      for (let j = 0; j < 8; j++) {
        if ((crcreg & 1) != 0) {
          crcreg = uint32(this.CRCPOLYNOMIAL ^ (crcreg >>> 1));
        }
        else {
          crcreg >>>= 1;
        }
      }
      this.crctable[i] = crcreg;
    }
  }

  static crc32(userId) {
    let crcstart = 0xFFFFFFFF;
    for (let i = 0; i < userId.length; i++) {
      const index = uint32((crcstart ^ userId.charCodeAt(i)) & 255);
      crcstart = (crcstart >>> 8) ^ this.crctable[index];
    }
    return crcstart;
  }

  static crc32LastIndex(userId) {
    let index = 0;
    let crcstart = 0xFFFFFFFF;
    for (let i = 0; i < userId.length; i++) {
      index = uint32(((crcstart ^ userId.charCodeAt(i)) & 255));
      crcstart = (crcstart >>> 8) ^ this.crctable[index];
    }
    return index;
  }

  static getCrcIndex(t) {
    for (let i = 0; i < 256; i++) {
      if ((this.crctable[i] >>> 24) === t) {
        return i;
      }
    }
    return -1;
  }

  static deepCheck(i, index) {
    const resultArray = new Array(2);

    let result = "";
    let tc;// = 0x00;
    let hashcode = this.crc32(String(i));
    tc = uint32((hashcode & 0xff ^ index[2]));

    if (!(tc <= 57 && tc >= 48)) {
      resultArray[0] = 0;
      return resultArray;
    }

    result += String(tc - 48);
    hashcode = this.crctable[index[2]] ^ (hashcode >>> 8);
    tc = uint32((hashcode & 0xff ^ index[1]));

    if (!(tc <= 57 && tc >= 48)) {
      resultArray[0] = 0;
      return resultArray;
    }

    result += String(tc - 48);
    hashcode = this.crctable[index[1]] ^ (hashcode >>> 8);
    tc = uint32((hashcode & 0xff ^ index[0]));

    if (!(tc <= 57 && tc >= 48)) {
      resultArray[0] = 0;
      return resultArray;
    }

    result += String(tc - 48);
    //hashcode = this.crctable[index[0]] ^ (hashcode >>> 8);

    resultArray[0] = 1;
    resultArray[1] = result;
    return resultArray;
  }

  parse(userId) {
    let deepCheckData = new Array(2);

    const index = new Array(4);
    let ht = uint32(parseInt(`0x${userId}`, 16));
    ht ^= 0xffffffff;

    let i;
    for (i = 3; i > -1; i--) {
      index[3 - i] = DanmakuSender.getCrcIndex(ht >>> (i * 8));
      const snum = uint32(DanmakuSender.crctable[index[3 - i]]);
      ht ^= snum >>> ((3 - i) * 8);
    }
    for (i = 0; i < 1000000000; i++) {
      const lastindex = uint32(DanmakuSender.crc32LastIndex(String(i)));
      if (lastindex === index[3]) {
        deepCheckData = DanmakuSender.deepCheck(i, index);
        if (deepCheckData[0] !== 0) {
          break;
        }
      }
    }
    if (i === 1000000000) {
      return "-1";
    }
    return `${i}${deepCheckData[1]}`;
  }

}

export default DanmakuSender