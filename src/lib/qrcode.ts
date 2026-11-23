/**
 * Pure TypeScript QR Code Generator (zero dependencies).
 * Based on the public domain implementation by Project Nayuki.
 */

export class Ecc {
  public static readonly LOW = new Ecc(0, 1);
  public static readonly MEDIUM = new Ecc(1, 0);
  public static readonly QUARTILE = new Ecc(2, 3);
  public static readonly HIGH = new Ecc(3, 2);
  private constructor(public readonly ordinal: number, public readonly formatBits: number) {}
}

export class Mode {
  public static readonly NUMERIC = new Mode(0x1, [10, 12, 14]);
  public static readonly ALPHANUMERIC = new Mode(0x2, [9, 11, 13]);
  public static readonly BYTE = new Mode(0x4, [8, 16, 16]);
  public static readonly KANJI = new Mode(0x8, [8, 10, 12]);
  private constructor(public readonly modeBits: number, private readonly numBitsCharCount: [number, number, number]) {}
  public numCharCountBits(ver: number): number {
    return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
  }
}

class BitBuffer {
  private buffer: Array<number> = [];
  public length: number = 0;

  public appendBits(val: number, len: number): void {
    if (len < 0 || len > 31 || val >>> len != 0)
      throw new RangeError("Value out of range");
    for (let i = len - 1; i >= 0; i--) {
      const bit = (val >>> i) & 1;
      const bufIndex = this.length >>> 3;
      if (bufIndex === this.buffer.length)
        this.buffer.push(0);
      this.buffer[bufIndex] |= bit << (7 - (this.length & 7));
      this.length++;
    }
  }

  public getBytes(): Array<number> {
    return this.buffer.slice();
  }
}

export class QrSegment {
  public static makeBytes(data: Readonly<Array<number>> | Uint8Array): QrSegment {
    const bb = new BitBuffer();
    for (const b of data)
      bb.appendBits(b, 8);
    return new QrSegment(Mode.BYTE, data.length, bb.getBytes());
  }

  public static makeSegments(text: string): Array<QrSegment> {
    const bytes: Array<number> = [];
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code < 0x80)
        bytes.push(code);
      else if (code < 0x800)
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      else if (code < 0xd800 || code >= 0xe000)
        bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      else {
        i++;
        code = 0x10000 + (((code & 0x3ff) << 10) | (text.charCodeAt(i) & 0x3ff));
        bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
    }
    return [QrSegment.makeBytes(bytes)];
  }

  public static getTotalBits(segs: Readonly<Array<QrSegment>>, version: number): number {
    let result = 0;
    for (const seg of segs) {
      const ccbits = seg.mode.numCharCountBits(version);
      result += 4 + ccbits + seg.getData().length;
    }
    return result;
  }

  private readonly bitData: Array<number>;

  public constructor(public readonly mode: Mode, public readonly numChars: number, bitData: Readonly<Array<number>>) {
    if (numChars < 0)
      throw new RangeError("Invalid argument");
    this.bitData = bitData.slice();
  }

  public getData(): Array<number> {
    const result: Array<number> = [];
    for (let i = 0; i < this.numChars * 8; i++) {
      result.push((this.bitData[i >>> 3] >>> (7 - (i & 7))) & 1);
    }
    return result;
  }
}

export class QrCode {
  public static encodeText(text: string, ecl: Ecc): QrCode {
    const seg = QrSegment.makeSegments(text);
    return QrCode.encodeSegments(seg, ecl);
  }

  public static encodeBinary(data: Readonly<Array<number>> | Uint8Array, ecl: Ecc): QrCode {
    const seg = QrSegment.makeBytes(data);
    return QrCode.encodeSegments([seg], ecl);
  }

  public static encodeSegments(segs: Readonly<Array<QrSegment>>, ecl: Ecc, minVersion: number = 1, maxVersion: number = 40, mask: number = -1, boostEcl: boolean = true): QrCode {
    if (!(1 <= minVersion && minVersion <= maxVersion && maxVersion <= 40) || mask < -1 || mask > 7)
      throw new RangeError("Invalid value");

    let version: number;
    let dataUsedBits: number;
    for (version = minVersion; ; version++) {
      const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
      const usedBits = QrSegment.getTotalBits(segs, version);
      if (usedBits <= dataCapacityBits) {
        dataUsedBits = usedBits;
        break;
      }
      if (version >= maxVersion)
        throw new RangeError("Data too long for QR Code");
    }

    if (boostEcl) {
      for (const newEcl of [Ecc.MEDIUM, Ecc.QUARTILE, Ecc.HIGH]) {
        if (dataUsedBits <= QrCode.getNumDataCodewords(version, newEcl) * 8)
          ecl = newEcl;
      }
    }

    const bb = new BitBuffer();
    for (const seg of segs) {
      bb.appendBits(seg.mode.modeBits, 4);
      bb.appendBits(seg.numChars, seg.mode.numCharCountBits(version));
      for (const b of seg.getData())
        bb.appendBits(b, 1);
    }

    const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
    bb.appendBits(0, Math.min(4, dataCapacityBits - bb.length));
    bb.appendBits(0, (8 - (bb.length % 8)) % 8);

    for (let padByte = 0xec; bb.length < dataCapacityBits; padByte ^= 0xec ^ 0x11)
      bb.appendBits(padByte, 8);

    const dataCodewords: Array<number> = [];
    while (dataCodewords.length * 8 < bb.length)
      dataCodewords.push(0);
    bb.getBytes().forEach((b, i) => (dataCodewords[i] = b));

    const allCodewords = QrCode.addEccAndInterleave(dataCodewords, version, ecl);
    return new QrCode(version, ecl, allCodewords, mask);
  }

  public readonly size: number;
  public readonly mask: number;
  private readonly modules: Array<Array<boolean>> = [];
  private readonly isFunction: Array<Array<boolean>> = [];

  public constructor(public readonly version: number, public readonly errorCorrectionLevel: Ecc, dataCodewords: Readonly<Array<number>>, mask: number) {
    if (version < 1 || version > 40)
      throw new RangeError("Version out of range");
    if (mask < -1 || mask > 7)
      throw new RangeError("Mask out of range");
    this.size = version * 4 + 17;

    const row: Array<boolean> = [];
    for (let i = 0; i < this.size; i++)
      row.push(false);
    for (let i = 0; i < this.size; i++) {
      this.modules.push(row.slice());
      this.isFunction.push(row.slice());
    }

    this.drawFunctionPatterns();
    const allCodewords = dataCodewords;
    this.drawCodewords(allCodewords);

    if (mask == -1) {
      let minPenalty = 1000000000;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          mask = i;
          minPenalty = penalty;
        }
        this.applyMask(i);
      }
    }
    this.mask = mask;
    this.applyMask(mask);
    this.drawFormatBits(mask);
    this.isFunction = [];
  }

  public getModule(x: number, y: number): boolean {
    return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
  }

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 == 0);
      this.setFunctionModule(i, 6, i % 2 == 0);
    }

    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);

    const alignPatPos = QrCode.getAlignmentPatternPositions(this.version);
    const numAlign = alignPatPos.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (!((i == 0 && j == 0) || (i == 0 && j == numAlign - 1) || (i == numAlign - 1 && j == 0)))
          this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
      }
    }

    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFormatBits(mask: number): void {
    const data = (this.errorCorrectionLevel.formatBits << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++)
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++)
      this.setFunctionModule(8, i, ((bits >>> i) & 1) != 0);
    this.setFunctionModule(8, 7, ((bits >>> 6) & 1) != 0);
    this.setFunctionModule(8, 8, ((bits >>> 7) & 1) != 0);
    this.setFunctionModule(7, 8, ((bits >>> 8) & 1) != 0);
    for (let i = 9; i < 15; i++)
      this.setFunctionModule(14 - i, 8, ((bits >>> i) & 1) != 0);

    for (let i = 0; i < 8; i++)
      this.setFunctionModule(this.size - 1 - i, 8, ((bits >>> i) & 1) != 0);
    for (let i = 8; i < 15; i++)
      this.setFunctionModule(8, this.size - 15 + i, ((bits >>> i) & 1) != 0);
    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    if (this.version < 7)
      return;

    let rem = this.version;
    for (let i = 0; i < 12; i++)
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem;

    for (let i = 0; i < 18; i++) {
      const color = ((bits >>> i) & 1) != 0;
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
          this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++)
        this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
    }
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawCodewords(data: Readonly<Array<number>>): void {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right == 6)
        right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) == 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) != 0;
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert: boolean;
        switch (mask) {
          case 0:  invert = (x + y) % 2 == 0;                    break;
          case 1:  invert = y % 2 == 0;                          break;
          case 2:  invert = x % 3 == 0;                          break;
          case 3:  invert = (x + y) % 3 == 0;                    break;
          case 4:  invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0; break;
          case 5:  invert = ((x * y) % 2) + ((x * y) % 3) == 0; break;
          case 6:  invert = (((x * y) % 2) + ((x * y) % 3)) % 2 == 0; break;
          case 7:  invert = (((x + y) % 2) + ((x * y) % 3)) % 2 == 0; break;
          default: throw new RangeError("Unreachable");
        }
        if (!this.isFunction[y][x] && invert)
          this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runX = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] == runColor) {
          runX++;
          if (runX == 5)
            result += 3;
          else if (runX > 5)
            result++;
        } else {
          this.finderPenaltyAddHistory(runX, runHistory);
          if (!runColor)
            result += this.finderPenaltyCountPatterns(runHistory) * 40;
          runColor = this.modules[y][x];
          runX = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * 40;
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runY = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] == runColor) {
          runY++;
          if (runY == 5)
            result += 3;
          else if (runY > 5)
            result++;
        } else {
          this.finderPenaltyAddHistory(runY, runHistory);
          if (!runColor)
            result += this.finderPenaltyCountPatterns(runHistory) * 40;
          runColor = this.modules[y][x];
          runY = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * 40;
    }

    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.modules[y][x];
        if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1])
          result += 3;
      }
    }

    let dark = 0;
    for (const row of this.modules)
      dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
    const total = this.size * this.size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * 10;
    return result;
  }

  private finderPenaltyAddHistory(currentRunLength: number, runHistory: Array<number>): void {
    if (runHistory[0] == 0)
      currentRunLength += this.size;
    runHistory.pop();
    runHistory.unshift(currentRunLength);
  }

  private finderPenaltyCountPatterns(runHistory: Readonly<Array<number>>): number {
    const n = runHistory[1];
    const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
    return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) +
      (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
  }

  private finderPenaltyTerminateAndCount(currentRunColor: boolean, currentRunLength: number, runHistory: Array<number>): number {
    if (currentRunColor) {
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      currentRunLength = 0;
    }
    currentRunLength += this.size;
    this.finderPenaltyAddHistory(currentRunLength, runHistory);
    return this.finderPenaltyCountPatterns(runHistory);
  }

  private static getAlignmentPatternPositions(version: number): Array<number> {
    if (version == 1)
      return [];
    const numAlign = Math.floor(version / 7) + 2;
    const step = (version == 32) ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result: Array<number> = [6];
    for (let pos = version * 4 + 10; result.length < numAlign; pos -= step)
      result.splice(1, 0, pos);
    return result;
  }

  private static getNumDataCodewords(ver: number, ecl: Ecc): number {
    return QrCode.NUM_ERROR_CORRECTION_CODEWORDS[ecl.ordinal][ver] ?
      Math.floor((QrCode.NUM_RAW_DATA_MODULES[ver] / 8)) -
      QrCode.NUM_ERROR_CORRECTION_CODEWORDS[ecl.ordinal][ver] *
      QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver] : 0;
  }

  private static addEccAndInterleave(data: Readonly<Array<number>>, ver: number, ecl: Ecc): Array<number> {
    const numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    const blockEccLen = QrCode.NUM_ERROR_CORRECTION_CODEWORDS[ecl.ordinal][ver];
    const rawCodewords = Math.floor(QrCode.NUM_RAW_DATA_MODULES[ver] / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: Array<Array<number>> = [];
    const rsDiv = QrCode.reedSolomonComputeDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0));
      k += dat.length;
      const ecc = QrCode.reedSolomonComputeRemainder(dat, rsDiv);
      if (i >= numShortBlocks)
        dat.push(data[k - 1]);
      blocks.push(dat.concat(ecc));
    }

    const result: Array<number> = [];
    for (let i = 0; i < blocks[0].length; i++) {
      for (let j = 0; j < blocks.length; j++) {
        if (i != shortBlockLen - blockEccLen || j >= numShortBlocks)
          result.push(blocks[j][i]);
      }
    }
    return result;
  }

  private static reedSolomonComputeDivisor(degree: number): Array<number> {
    const result: Array<number> = [];
    for (let i = 0; i < degree - 1; i++)
      result.push(0);
    result.push(1);

    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < result.length; j++) {
        result[j] = QrCode.reedSolomonMultiply(result[j], root);
        if (j + 1 < result.length)
          result[j] ^= result[j + 1];
      }
      root = QrCode.reedSolomonMultiply(root, 0x02);
    }
    return result;
  }

  private static reedSolomonComputeRemainder(data: Readonly<Array<number>>, divisor: Readonly<Array<number>>): Array<number> {
    const result = divisor.map((_) => 0);
    for (const b of data) {
      const factor = b ^ (result.shift() as number);
      result.push(0);
      divisor.forEach((coef, i) => (result[i] ^= QrCode.reedSolomonMultiply(coef, factor)));
    }
    return result;
  }

  private static reedSolomonMultiply(x: number, y: number): number {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }

  private static readonly NUM_ERROR_CORRECTION_CODEWORDS: number[][] = [
    [-1,  7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  ];

  private static readonly NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 72, 74, 79],
  ];

  private static readonly NUM_RAW_DATA_MODULES: number[] = [
    0, 208, 359, 567, 807, 1079, 1383, 1568, 1936, 2336, 2768, 3232, 3728, 4256, 4651, 5243, 5867, 6523, 7211, 7931,
    8683, 9252, 10068, 10916, 11796, 12708, 13652, 14628, 15371, 16411, 17483, 18587, 19723, 20891, 22091, 23008, 24272, 25568, 26896, 28256, 29648
  ];
}
