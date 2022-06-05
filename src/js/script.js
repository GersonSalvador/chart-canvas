class ChartCanvas {

  constructor(elId, values, settings) {

    this.PI = Math.PI
    this.handleSettings(settings)
    this.handleCanvasEl(elId)
    this.handleRaduis(values.length)

    values.forEach((v, index) => this.drawCircle(v, index))

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

  drawCircle({ color, degree }, index) {

    this.ctx.beginPath();
    this.ctx.strokeStyle = color || this.handleColor();
    this.ctx.lineWidth = this.settings.lineWidth;
    this.ctx.arc(this.x, this.y, this.radius[index], 1.5 * this.PI, this.calcDrgree(degree));
    this.ctx.stroke();

  }

  handleSettings(settings) {

    const defaultSettings = {
      width: 400,
      height: 400,
      margin: [20, 20, 20, 20],
      maxValue: 100,
      lineWidth: 10,
    }

    this.settings = { ...defaultSettings, ...settings }
    this.handleXYAxis()
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

  handleXYAxis() {

    const { width, height } = this.settings

    this.x = width / 2
    this.y = height / 2
  }

  handleRaduis(times) {

    const { width, height, margin, lineWidth } = this.settings
    const xArea = width - margin[1] - margin[3]
    const yArea = height - margin[0] - margin[2]

    const firstRadius = (((xArea < yArea ? xArea : yArea) / 2) - lineWidth / 2)

    this.radius = [...Array(times)].map((n, index) => {

      const marginBetween = 1 * index
      const otherRadius = index * lineWidth

      return firstRadius - otherRadius - marginBetween

    })

  }

}
