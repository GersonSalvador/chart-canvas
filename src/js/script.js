class ChartCanvas {

  constructor(elId, values, settings) {

    this.PI = Math.PI
    this.handleSettings(settings)
    this.handleCanvasEl(elId)

    values.forEach(v => this.drawCircle(v))

  }

  handleColor(color) {

    const colors = this.colors || []
    let hue = false
    if (colors.length < 36) {

      while (hue === false) {
        const randomHue = (parseInt((Math.random() * 36)) * 10) + 1
        hue = colors.find(c => c === randomHue) ? false : randomHue

      }

      this.colors = [...colors, hue]

    } else {

      hue = this.colors[parseInt(Math.random() * 36)]

    }

    return color || `hsl(${hue}, 45%, 80%)`

  }

  calcDrgree(num) {

    return ((num / 180) + 1.5) * this.PI

  }

  drawCircle({ color, degree, size }) {

    this.ctx.beginPath();
    this.ctx.strokeStyle = color || this.handleColor();
    this.ctx.lineWidth = 10;
    this.ctx.arc(200, 200, size, 1.5 * this.PI, this.calcDrgree(degree));
    this.ctx.stroke();

  }

  handleSettings(settings) {

    const defaultSettings = {
      width: 400,
      height: 400,
      maxValue: 100
    }

    this.settings = { ...defaultSettings, ...settings }

  }

  handleCanvasEl(elId) {

    const canvas = document.querySelector(elId)

    canvas.width = this.settings.width;
    canvas.height = this.settings.height;

    this.canvas = canvas

    this.handleContext()

  }

  handleContext() {

    this.ctx = this.canvas.getContext("2d");

  }
}
