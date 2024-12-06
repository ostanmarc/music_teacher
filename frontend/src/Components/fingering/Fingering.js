import _ from 'lodash'
import { bitCount, showFlat } from './Util'

export class Fingering {
  basePitch = 13 // C# 
  
  lh1     = new Key(12, this, () =>                                        -2     )
  bis     = new Key(11, this, () => this.lh1.pressed && this.lh2.pressed ?  0 : -1)
  lh2     = new Key(10, this, () => this.lh1.pressed                     ? -2 : -1)
  lh3     = new Key( 9, this, () =>                                        -2)
  
  lpinky1 = new Key( 8, this, () =>                                         1     )
  lpinky2 = new Key( 7, this, () =>                                        -1     )
  
  rside   = new Key( 6, this, () => !this.lpinky1.pressed                ? +1 :  0)
  rh1     = new Key( 5, this, () => !this.lh3.pressed                    ? -1 : -2)
  rh2     = new Key( 4, this, () =>                                        -1     )
  rh3     = new Key( 3, this, () =>                                        -2     )
  
  rpinky1 = new Key( 2, this, () =>                                         1     )
  rpinky2 = new Key( 1, this, () =>                                        -1     )
  rpinky3 = new Key( 0, this, () =>                                        -2     )

  roller = 0 // default (middle) octave. Range: -2 to 4
  
  keys = [
    this.lh1, this.bis, this.lh2, this.lh3, this.lpinky1, this.lpinky2,
    this.rside, this.rh1, this.rh2, this.rh3, this.rpinky1, this.rpinky2, this.rpinky3
  ]
  
  constructor(bitmask = 0, roller = 0, flat = false) {
    this.bitmask = bitmask
    this.roller = roller
    this.flat = flat
    this._pitch = null

    this.rollerDiff = 0

    if (!bitmask)
      return

    this.keys
      .filter(k => (bitmask & (1 << k.index)) !== 0)
      .forEach(k => k.press(false))
  }
  
  get id() {
    return this.bitmask
  }

  get bitmaskString() {
    return this.bitmask.toString(2)
  }
  
  get pitch() {
    if (this._pitch === null) {
      this._pitch = this.basePitch + this.keys
        .filter(key => key._pressed)
        .map(key => key.pitch)
        .reduce((prev, cur) => prev + cur, 0)
    }

    return this._pitch
  }
  
  get note() {
    let note;
    switch (this.pitch) {
      case -2: note = 'A#' ; break;
      case -1: note = 'B'  ; break;
      case  0: note = 'c'  ; break;
      case  1: note = 'c#' ; break;
      case  2: note = 'd'  ; break;
      case  3: note = 'd#' ; break;
      case  4: note = 'e'  ; break;
      case  5: note = 'f'  ; break;
      case  6: note = 'f#' ; break;
      case  7: note = 'g'  ; break;
      case  8: note = 'g#' ; break;
      case  9: note = 'a'  ; break;
      case 10: note = 'a#' ; break;
      case 11: note = 'b'  ; break;
      case 12: note = "c'" ; break;
      case 13: note = "c#'"; break;
      case 14: note = "d'" ; break;
      case 15: note = "d#'"; break;
      default: 
        console.error('Invalid pitch')
    }
    if (this.flat)
      note = showFlat(note)

    return note
  }
  
  distance(other) {
    return bitCount(this.bitmask ^ other.bitmask)
  }

  updateBitmask(index, pressed) {
    let pos = 1 << index
    if (Boolean(this.bitmask & pos) !== pressed) {
      this.bitmask = this.bitmask ^ pos
      this._pitch = null
    }
  }

  applyDiff(previousFingering, includeRoller=true) {
    for(let i = 0; i < this.keys.length; i++) {
      if (this.keys[i]._pressed && !previousFingering.keys[i].pressed)
        this.keys[i].diff = 1
      else if (!this.keys[i]._pressed && previousFingering.keys[i].pressed)
        this.keys[i].diff = -1
      else 
        this.keys[i].diff = 0
    }

    if (includeRoller)
      this.rollerDiff = this.roller - previousFingering.roller
  }
  
  get pressedKeys() { return this.keys.filter(k => k._pressed) }
  
  get redundant() { return this.keys.some(k => k.redundant) }
  
  get hasNeutralizingKeys() {
    let pressed = this.pressedKeys
    let hasKeyWithPitch = x => pressed.some(k => k.pitch === x)
    return hasKeyWithPitch(1) && hasKeyWithPitch(-1)
  }
  
  get allRightPinkyKeysPressed() {
    // NOTE: subset of hasNeutralizingKeys
    return this.rpinky1._pressed && this.rpinky2._pressed && this.rpinky3._pressed
  }

  get badBisKeyUsage() {
    return this.bis._pressed && !(this.lh1._pressed || this.lh2._pressed)
  }
}

class Key {
  constructor(index, fingering, pitch, pressed = false) {
    this.index = index
    this.fingering = fingering
    this._pitch = pitch
    this._pressed = pressed
    this.diff = 0
  }

  get pitch() { return this._pitch() }

  get pressed() { return this._pressed }

  get redundant() { return this.pitch === 0 && this._pressed }

  press(updateFingering=true) {
    this._pressed = true
    if (updateFingering)
      this.fingering.updateBitmask(this.index, true)
  }

  unpress() {
    this._pressed = false
    this.fingering.updateBitmask(this.index, false)
  }

  toggle() {
    this._pressed = !this._pressed
    this.fingering.updateBitmask(this.index, this._pressed)
  }
}


export function allCombinations(fingering) {
  // console.time('allCombinations()')

  let numCombinations = 2 ** fingering.keys.length;
  let fingerings = _.times(numCombinations, bitmask => new Fingering(bitmask))

  // console.log('combinations: ', fingerings.length)

  // console.time('filter out redundant')
  fingerings = fingerings.filter(fingering => !fingering.redundant)
  // console.timeEnd('filter out redundant')
  // console.log('combinations: ', fingerings.length)

  // console.time('filter out allRightPinkyKeysPressed')
  fingerings = fingerings.filter(fingering => !fingering.allRightPinkyKeysPressed)
  // console.timeEnd('filter out allRightPinkyKeysPressed')
  // console.log('combinations: ', fingerings.length)

  // console.time('filter out neutralizing keys')
  fingerings = fingerings.filter(fingering => !fingering.hasNeutralizingKeys)
  // console.timeEnd('filter out neutralizing keys')
  // console.log('combinations: ', fingerings.length)

  // console.time('filter out bad bis key usage')
  fingerings = fingerings.filter(fingering => !fingering.badBisKeyUsage)
  // console.timeEnd('filter out bad bis key usage')
  // console.log('combinations: ', fingerings.length)

  // console.time('group by pitch')
  let fingeringsByPitch = _.groupBy(fingerings, fingering => fingering.pitch)
  // console.log(fingeringsByPitch)
  // console.timeEnd('group by pitch')

  for (let pitch in fingeringsByPitch) {
    if (!fingeringsByPitch.hasOwnProperty(pitch))
      continue
    
    // reverse to make fingerings that use more 'upper' keys appear first
    fingeringsByPitch[pitch].reverse()

    // sort by number of pressed keys 
    fingeringsByPitch[pitch] = _.sortBy(fingeringsByPitch[pitch], fingering => fingering.pressedKeys.length)

    // console.log(fingeringsByPitch[pitch][0].note)
    // console.log(fingeringsByPitch[pitch].slice(0,5).map(ewi => `${ewi.id}, ${ewi.pressedKeys.length}]`))
  }

  // TODO!: further/different sort criteria...
  // - distance to default fingering (smaller = better)
  // - number of 'gaps' between pressed keys?? (smaller = better)
  // - penalty for bis key?

  //  console.timeEnd('allCombinations()')

  return fingeringsByPitch
}

// Standard fingerings as found in the EWI 5000 User Guide page 39
const STANDARD_FINGERINGS_EWI = [
  0b1011010111011, // Bb3 (A#3)
  0b1011010111001, // B3
  0b1011000111001, // C4
  0b1011100111001, // C#4 (Db4)
  0b1011000111000, // D4
  0b1011000111100, // D#4 (Eb4)
  0b1011000110000, // E4
  0b1011000100000, // F4
  0b1011000010000, // F#4 (Gb4)
  0b1011000000000, // G4
  0b1011100000000, // G#4 (Ab4)
  0b1010000000000, // A4
  0b1010001000000, // A#4 (Bb4)
  0b1000000000000, // B4
  0b0010000000000, // C5
  0b0001000000000, // C#5 (Db5)
  0b0000100000000, // D5
  0b0000100000100, // D#5 (Eb5)
  0b0000010000000, // E5
  0b0000001000000, // F5
  0b0000000100000, // F#5 (Gb5)
  0b0000000010000, // G5
  0b0000000001000, // G#5 (Ab5)
  0b0000000000100, // A5
  0b0000000000010, // A#5 (Bb5)
  0b0000000000001, // B5
  0b1110000000000, // C6
  0b1101000000000, // C#6 (Db6)
  0b1100100000000, // D6
  0b1100010000000, // D#6 (Eb6)
  0b1011110000000, // E6
  0b1011101000000, // F6
  0b1011100100000, // F#6 (Gb6)
];

export const STANDARD_FINGERINGS_BY_NOTE = {
  "Bb3": STANDARD_FINGERINGS_EWI[0], "A#3": STANDARD_FINGERINGS_EWI[0],
  "B3": STANDARD_FINGERINGS_EWI[1],
  "C4": STANDARD_FINGERINGS_EWI[2],
  "C#4": STANDARD_FINGERINGS_EWI[3], "Db4": STANDARD_FINGERINGS_EWI[3],
  "D4": STANDARD_FINGERINGS_EWI[4],
  "D#4": STANDARD_FINGERINGS_EWI[5], "Eb4": STANDARD_FINGERINGS_EWI[5],
  "E4": STANDARD_FINGERINGS_EWI[6],
  "F4": STANDARD_FINGERINGS_EWI[7],
  "F#4": STANDARD_FINGERINGS_EWI[8], "Gb4": STANDARD_FINGERINGS_EWI[8],
  "G4": STANDARD_FINGERINGS_EWI[9],
  "G#4": STANDARD_FINGERINGS_EWI[10], "Ab4": STANDARD_FINGERINGS_EWI[10],
  "A4": STANDARD_FINGERINGS_EWI[11],
  "A#4": STANDARD_FINGERINGS_EWI[12], "Bb4": STANDARD_FINGERINGS_EWI[12],
  "B4": STANDARD_FINGERINGS_EWI[13],
  "C5": STANDARD_FINGERINGS_EWI[14],
  "C#5": STANDARD_FINGERINGS_EWI[15], "Db5": STANDARD_FINGERINGS_EWI[15],
  "D5": STANDARD_FINGERINGS_EWI[16],
  "D#5": STANDARD_FINGERINGS_EWI[17], "Eb5": STANDARD_FINGERINGS_EWI[17],
  "E5": STANDARD_FINGERINGS_EWI[18],
  "F5": STANDARD_FINGERINGS_EWI[19],
  "F#5": STANDARD_FINGERINGS_EWI[20], "Gb5": STANDARD_FINGERINGS_EWI[20],
  "G5": STANDARD_FINGERINGS_EWI[21],
  "G#5": STANDARD_FINGERINGS_EWI[22], "Ab5": STANDARD_FINGERINGS_EWI[22],
  "A5": STANDARD_FINGERINGS_EWI[23],
  "A#5": STANDARD_FINGERINGS_EWI[24], "Bb5": STANDARD_FINGERINGS_EWI[24],
  "B5": STANDARD_FINGERINGS_EWI[25],
  "C6": STANDARD_FINGERINGS_EWI[26],
  "C#6": STANDARD_FINGERINGS_EWI[27], "Db6": STANDARD_FINGERINGS_EWI[27],
  "D6": STANDARD_FINGERINGS_EWI[28],
  "D#6": STANDARD_FINGERINGS_EWI[29], "Eb6": STANDARD_FINGERINGS_EWI[29],
  "E6": STANDARD_FINGERINGS_EWI[30],
  "F6": STANDARD_FINGERINGS_EWI[31],
  "F#6": STANDARD_FINGERINGS_EWI[32], "Gb6": STANDARD_FINGERINGS_EWI[32],
};


export function isStandardFingering(fingering) {
  return STANDARD_FINGERINGS_EWI.indexOf(fingering.bitmask) !== -1
}
