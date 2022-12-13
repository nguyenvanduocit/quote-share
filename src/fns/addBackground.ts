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
    }
]

export const createBackground = (width: number, height: number) => {
    const background = backgrounds[0]
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
