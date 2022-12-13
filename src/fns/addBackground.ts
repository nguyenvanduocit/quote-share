import { fabric } from 'fabric'

export const createBackground = (width: number, height: number) => {
    const grad = new fabric.Gradient({
        type: 'linear',
        coords: {
            x1: 0,
            y1: 0,
            x2: width,
            y2: height
        },
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
    })

    return new fabric.Rect({
        width: width,
        height: height,
        fill: grad,
        selectable: false
    })
}
