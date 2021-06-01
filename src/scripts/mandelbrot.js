import Complex from 'complex'

const mandelbrot = {
    canvas: null,
    ctx: null,
    halfWidth: 0,
    halfHeight: 0,
    mappingFactor: 0,
    maxIterations: 18,
    resolution: 1,
    offsetValueX: 0,
    offsetValueY: 0,
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            window.complex = Complex
            this.loadCanvas()
            this.drawMandelbrot()
            this.addClickEvent()
        })
    },
    utils: {
        rgb(r, g, b) {
            return `rgb(${r}, ${g}, ${b})`
        },
        getColor(x, y) {
            const C = new Complex(x, y)
            let Z = new Complex(0, 0)
            for (let i = 0; i < mandelbrot.maxIterations; ++i) {
                const prevZ = Z.clone()
                Z.pow(2)
                if (isNaN(Z.real) || isNaN(Z.im)) {
                    Z = new Complex(0, 0)
                }
                Z.add(C)
                if (Z.equals(prevZ)) {
                    return this.rgb(0, 0, 0)
                }
                if (Z.abs() > 2) {
                    const rgb = (Math.pow(i, 1) / mandelbrot.maxIterations * 200) + 55
                    return this.rgb(rgb, rgb, rgb)
                }
            }
            return this.rgb(0, 0, 0)
        },
        getOffsetValueForAxis(axis) {
            switch (axis) {
                case 'x': return mandelbrot.offsetValueX
                case 'y': return mandelbrot.offsetValueY
                default: throw new Error('"axis" argument is required and should be either of "x" or "y"')
            }
        },
        mapValueToCoordinate(axis, value) {
            return mandelbrot.mappingFactor * value + this.getOffsetValueForAxis(axis);
        },
        mapCoordinateToValue(axis, coordinate) {
            return coordinate / mandelbrot.mappingFactor + this.getOffsetValueForAxis(axis);
        }
    },
    loadCanvas() {
        this.canvas = document.querySelector('canvas#canvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext('2d')
        this.halfWidth = this.canvas.width / 2
        this.halfHeight = this.canvas.height / 2
        this.mappingFactor = Math.min(this.halfWidth, this.halfHeight) * 0.95 / 1.5
        this.ctx.translate(this.halfWidth, this.halfHeight)
    },
    drawMandelbrot() {
        for (let x = - this.halfWidth; x < this.halfWidth; x++) {
            const valueX = this.utils.mapCoordinateToValue('x', x)

            for (let y = - this.halfHeight; y < this.halfHeight; y++) {
                const valueY = this.utils.mapCoordinateToValue('y', y)
                this.ctx.fillStyle = this.utils.getColor(valueX, valueY)
                this.ctx.fillRect(x, y, 1, 1)
            }
        }
    },
    addClickEvent() {
        this.canvas.addEventListener('click', (event) => {
            this.offsetValueX = this.utils.mapCoordinateToValue('x', event.clientX - this.halfWidth)
            this.offsetValueY = this.utils.mapCoordinateToValue('y', event.clientY - this.halfHeight)
            this.repaint()
        })
    },
    repaint() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawMandelbrot()
    }
}

window.mandelbrot = mandelbrot

export default mandelbrot