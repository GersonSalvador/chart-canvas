class ChartCanvas {

  constructor(elId, values, settings) {

    this.PI = Math.PI
    this.handleSettings(settings, values)
    this.handleCanvasEl(elId)
    this.handleLineHeight()
    this.handleRaduis()

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

    const { baseValue, maxDegree, maxValue } = this.settings
    const value = num * baseValue
    const finalValue = value > maxDegree ? maxDegree : value
    const degree = (((finalValue / 180) + 1.5) * this.PI)

    return degree

  }

  drawCircle({ color, degree }, index) {

    this.ctx.beginPath();
    this.ctx.strokeStyle = color || this.handleColor();
    this.ctx.lineWidth = this.settings.lineWidth;
    this.ctx.arc(this.x, this.y, this.radius[index], 1.5 * this.PI, this.calcDrgree(degree));
    this.ctx.stroke();

  }

  handleSettings(settings, values) {

    const times = values.length

    const defaultSettings = {
      width: 400,
      height: 400,
      margin: [20, 20, 20, 20],
      maxValue: 100,
      maxDegree: 360 * .85,
      times,
    }

    this.settings = { ...defaultSettings, ...settings }
    this.handleXYAxis()
    this.calcBaseValue()
  }

  calcBaseValue() {

    const base = this.settings.maxDegree / this.settings.maxValue

    this.settings.baseValue = base

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

  handleRaduis() {

    const { width, height, margin, lineWidth } = this.settings
    const xArea = width - margin[1] - margin[3]
    const yArea = height - margin[0] - margin[2]

    const firstRadius = (((xArea < yArea ? xArea : yArea) / 2) - lineWidth / 2)

    this.radius = [...Array(this.settings.times)].map((n, index) => {

      const marginBetween = 1 * index
      const otherRadius = index * lineWidth

      return firstRadius - otherRadius - marginBetween

    })

  }

  handleLineHeight() {

    const halfRadius = (this.x > this.y ? this.x : this.y) / 2
    this.settings.lineWidth = halfRadius / this.settings.times

  }

}
