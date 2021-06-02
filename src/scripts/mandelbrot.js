import Complex from 'complex'

const mandelbrot = {
    canvas: null,
    ctx: null,
    halfWidth: 0,
    halfHeight: 0,
    settings: {
        resolution: 2.5,
        maxIterations: 18,
        escapeRadius: 2,
    },
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadCanvas()
            this.drawMandelbrot()
            this.addClickEvent()
        })
    },
    utils: {
        report() {
            console.log("settings: ", mandelbrot.settings);
        },
        rgb(r, g, b) {
            return `rgb(${parseInt(r)}, ${parseInt(g)}, ${parseInt(b)})`
        },
        getColor(x, y) {
            const C = new Complex(x, y)
            let Z = new Complex(0, 0)
            for (let i = 0; i < mandelbrot.settings.maxIterations; ++i) {
                const prevZ = Z.clone()
                Z.pow(2)
                if (isNaN(Z.real) || isNaN(Z.im)) {
                    Z = new Complex(0, 0)
                }
                Z.add(C)
                if (Z.equals(prevZ)) {
                    return this.rgb(0, 0, 0)
                }
                if (Z.abs() > mandelbrot.settings.escapeRadius) {
                    const rgb = (i / mandelbrot.settings.maxIterations * 200) + 55
                    return this.rgb(rgb, rgb, rgb)
                }
            }
            return this.rgb(0, 0, 0)
        },
        getMappingFactor(axis) {
            const mappingFactor = Math.min(mandelbrot.halfWidth, mandelbrot.halfHeight) / mandelbrot.settings.resolution
            return axis === 'y' ? -mappingFactor : mappingFactor
        },
        mapValueToCoordinate(axis, value) {
            return Math.round((value * this.getMappingFactor(axis)))
        },
        mapCoordinateToValue(axis, coordinate) {
            return coordinate / this.getMappingFactor(axis)
        }
    },
    loadCanvas() {
        this.canvas = document.querySelector('canvas#canvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext('2d')
        this.halfWidth = Math.floor(this.canvas.width / 2)
        this.halfHeight = Math.floor(this.canvas.height / 2)
        this.ctx.translate(this.halfWidth, this.halfHeight)
    },
    drawMandelbrot() {
        for (let x = - this.halfWidth; x < this.halfWidth; x++) {
            const valueX = this.utils.mapCoordinateToValue('x', x)

            for (let y = - this.halfHeight; y < this.halfHeight; y++) {
                const valueY = this.utils.mapCoordinateToValue('y', y)
                this.ctx.fillStyle = this.utils.getColor(valueX, valueY)
                this.ctx.fillRect(x, y, 1, 1)
                this.ctx.fillRect(x, -y, 1, 1)
            }
        }
        this.utils.report()
    },
    addClickEvent() {
        this.canvas.addEventListener('click', (event) => {
            // this.settings.offsetX += event.clientX - this.halfWidth
            // this.settings.offsetY += event.clientY - this.halfHeight
            this.settings.resolution *= 0.4
            // this.settings.maxIterations += 20
            this.drawMandelbrot()
        })
    },
}

window.mandelbrot = mandelbrot
window.complex = Complex

export default mandelbrot