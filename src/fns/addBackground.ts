import { fabric } from 'fabric'

const width = 1920
const height = 1400

export const backgrounds = [
    {
        css: 'background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);',
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: width, y2: height },
        colorStops: [
            {
                color: '#0093E9',
                offset: 0
            },
            {
                color: '#80D0C7',
                offset: 1
            }
        ]
    },
    {
        css: 'background-image: radial-gradient( circle farthest-corner at 12.3% 19.3%,  rgba(85,88,218,1) 0%, rgba(95,209,249,1) 100.2% );',
        type: 'radial',
        coords: {
            x1: width * 0.123,
            y1: height * 0.193,
            r1: 0,
            x2: width * 0.123,
            y2: height * 0.193,
            r2: width
        },
        colorStops: [
            {
                color: 'rgba(85,88,218,1)',
                offset: 0
            },
            {
                color: 'rgba(95,209,249,1)',
                offset: 1
            }
        ]
    },
    {
        css: 'background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,209,67,1) 0%, rgba(255,145,83,1) 90% );',
        type: 'radial',
        coords: {
            x1: width * 0.1,
            y1: height * 0.2,
            r1: 0,
            x2: width * 0.1,
            y2: height * 0.2,
            r2: width
        },
        colorStops: [
            {
                color: 'rgba(255,209,67,1)',
                offset: 0
            },
            {
                color: 'rgba(255,145,83,1)',
                offset: 0.9
            }
        ]
    },
    {
        css: 'background-image: radial-gradient( circle farthest-corner at 10% 20%, rgba(228,93,93,1) 0%, rgba(248,148,233,1) 90% );',
        type: 'radial',
        coords: {
            x1: width * 0.1,
            y1: height * 0.2,
            r1: 0,
            x2: width * 0.1,
            y2: height * 0.2,
            r2: width
        },
        colorStops: [
            {
                color: 'rgba(228,93,93,1)',
                offset: 0
            },
            {
                color: 'rgba(248,148,233,1)',
                offset: 0.9
            }
        ]
    },
    {
        css: 'background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% );',
        type: 'radial',
        coords: {
            x1: width * 0.1,
            y1: height * 0.2,
            r1: 0,
            x2: width * 0.1,
            y2: height * 0.2,
            r2: width
        },
        colorStops: [
            {
                color: 'rgba(14,174,87,1)',
                offset: 0
            },
            {
                color: 'rgba(12,116,117,1)',
                offset: 0.9
            }
        ]
    },

    {
        css: 'background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,229,168,1) 0%, rgba(251,174,222,1) 100.7% );',
        type: 'radial',
        coords: {
            x1: width * 0.1,
            y1: height * 0.2,
            r1: 0,
            x2: width * 0.1,
            y2: height * 0.2,
            r2: width
        },
        colorStops: [
            {
                color: 'rgba(255,229,168,1)',
                offset: 0
            }, {
                color: 'rgba(251,174,222,1)',
                offset: 1
            }
        ]
    }
]

export const createBackground = (backgroundIndex: number) => {
const background = backgrounds[backgroundIndex]
    const grad = new fabric.Gradient(background)

    return new fabric.Rect({
        name: 'background',
        width: width,
        height: height,
        fill: grad,
        selectable: false
    })
}
