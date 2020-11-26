import { NotesArray, NotesBoundaries } from './NoteConstants';

let startTime = 0;
let frameCounter = 0, measureLength = 25;
let minDrawRate = .6, minDrawMLength = measureLength * minDrawRate, measurements: number[][] = [];

export const findNote = (frequency: number) => {
    for (let index = 0; 71 >= index; index++)
        if (frequency > NotesBoundaries[index][0] && frequency <= NotesBoundaries[index][1])
            return index;
    return -1;
}

export const findWaveLength = (
    timeDomainData: Float32Array,
    r: number,
    t: number,
    o: number,
    n: number,
    a: number,
    i: number) => {
    let u = 0, c = 0, l = 0, s = [];
    for (let m = 0; m < timeDomainData.length - 1; m++) {
        s.push(timeDomainData[m]);
        for (var d = 1; i > d; d++)
            s.push(timeDomainData[m] + (timeDomainData[m + 1] - timeDomainData[m]) * d / i)
    }
    s.push(timeDomainData[timeDomainData.length - 1]);
    r *= i;
    t *= i;
    let g = s.length, f = [], h = 0, w = 0, A = 0;
    for (let d = 0; t > d; d++) {
        if (Math.abs(s[d]) > h) {
            w = d;
            h = Math.abs(s[d]);
        }
        A += Math.abs(s[d]);
    }
    if (a > A / t)
        return -1;
    if (0 === w || w === t)
        return -1;
    let C = 0, D = 0, v = 0, y = 0, p = 0, T = 0, F = 0, b = 0, k = 0;
    for (d = r; t >= d; d++) {
        F = 0;
        b = 0;
        C = 0;
        D = 0;
        for (let N = w; g > N; N += d) {
            F += s[N];
            if (0 !== b && g - 5 * i > N) {
                k = s[N] / s[w];
                if (k > 0) {
                    if (k > 1)
                        k = 1;
                    u = s[N];
                    l = s[N - 5 * i];
                    c = s[N + 5 * i];
                    if (s[w] >= 0) {
                        if (u > c && u > l) {
                            C += k * k * k * k * s[w] * o * (t - d) / t;
                            D++;
                        }
                    } else {
                        if (c > u && l > u) {
                            C += k * k * k * k * s[w] * o * (t - d) / t;
                        }
                        D++;
                    }

                }
            }
            b++;
            if (b >= n)
                N = g;
            F += C * D / b;
            F /= b;
            if (F > v) {
                v = F;
                p = d;
            } else if (y > F) {
                y = F;
                T = d;
            }
            f.push(F);
        }
    }
    return s[w] >= 0 ? p / i : T / i
}

export const captureNote = (timeDomainData: Float32Array, sampleRate: number, globalK: number) => {
    frameCounter++;
    if (Date.now() - startTime >= 450) {
        measureLength = frameCounter;
        minDrawMLength = frameCounter * minDrawRate;
        startTime = Date.now();
        frameCounter = 0;
    }
    let frequency = sampleRate / findWaveLength(timeDomainData, globalK * 24, globalK * 1200, 10, 10, .016, Math.ceil(10 / globalK));
    if (frequency <= 0) return "";
    measurements.push([frequency, findNote(frequency)]);
    if (measurements.length > measureLength) {
        measurements = measurements.slice(measurements.length - measureLength);
    }
    let r = 0;
    let t = 0;
    let o = 0;
    let a = 0;
    let n = 0;
    n = measurements.length;
    for (; n > a; a++) {
        t = 0;
        for (let i = 0; n > i; i++) {
            if (measurements[a][1] === measurements[i][1]) {
                t++;
                if (t >= r) {
                    r = t;
                    o = a;
                }
            }
        }
    }
    let u = [];
    a = 0;
    for (; n > a; a++)
        measurements[a][1] === measurements[o][1] && u.push(measurements[a][0]);
    if (u.length >= minDrawMLength) {
        frequency = u.reduce(function (e, r) {
            return e + r
        }) / u.length;
    }
    return NotesArray[findNote(frequency)][1] as string;
}
