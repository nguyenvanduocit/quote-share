import { fabric } from 'fabric'

const backgrounds = [
    {
        type: 'linear',
        coords:{},
        colorStops: [
            {
                color: 'rgb(166,111,213)',
                offset: 0
            },
            {
                color: 'rgba(106, 72, 215, 0.5)',
                offset: 0.5
            },
            {
                color: '#200772',
                offset: 1
            }
        ]
    },
    // background-color: #0093E9;
    // background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    {
        type: 'linear',
        coords:{},
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
    }
]

export const createBackground = (width: number, height: number) => {
    // get random background
    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    background.coords ={x1:0, y1:0, x2: width, y2: height}

    const grad = new fabric.Gradient(background)

    return new fabric.Rect({
        name: 'background',
        width: width,
        height: height,
        fill: grad,
        selectable: false
    })
}
