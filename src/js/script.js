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

    const { baseValue, maxDegree, } = this.settings
    const value = num * baseValue
    const finalValue = value > maxDegree ? maxDegree : value
    const degree = (((finalValue / 180) + 1.5) * this.PI)

    return { degree, finalValue }

  }

  calcRotateStep(radius, lineWidth) {

    const { PI, degree } = this
    const degreePx = (PI / 180) * radius
    const ratio = lineWidth / degreePx

    return ratio / degree / 6500

  }

  drawTextAlongArc(ctx, str, centerX, centerY, radius, finalValue, lineWidth) {

    const { degree } = this
    const rotate = this.calcRotateStep(radius, lineWidth)
    const len = str.length
    let s

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.font = `${(lineWidth)}px monospace`;
    ctx.rotate((degree * finalValue) + rotate * 1);

    for (var n = 0; n < len; n++) {
      s = str[n];
      ctx.rotate(rotate);
      ctx.save();
      ctx.translate(0, -1 * radius);
      ctx.fillText(s, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }

  drawCircle({ color, value, label }, index) {

    const { ctx, radius, } = this
    const { lineWidth, margin, value: { prefix, sulfix } } = this.settings
    const { degree, finalValue } = this.calcDrgree(value)

    ctx.beginPath();
    ctx.strokeStyle = color || this.handleColor();
    ctx.lineWidth = lineWidth;
    ctx.arc(this.x, this.y, radius[index], 1.5 * this.PI, degree);
    ctx.stroke();

    //label
    ctx.font = `${(lineWidth)}px Arial`;
    ctx.textAlign = 'end'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, this.y - 4, margin[0] + ((index + 1) * (lineWidth + 1)) - (lineWidth * .43));

    //value
    ctx.font = `${(lineWidth * .75)}px Arial`;
    this.drawTextAlongArc(
      ctx,
      `${prefix}${value}${sulfix}`,
      this.x,
      this.y,
      radius[index],
      finalValue,
      lineWidth * .5
    )

  }

  calcEndOfArc(degree, radius) {

    const x = this.x + Math.cos(degree) * radius;
    const y = this.y + Math.sin(degree) * radius;

    return [x, y]
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
    this.degree = 2 * Math.PI / 360
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
    console.log({ firstRadius })

    this.radius = [...Array(this.settings.times)].map((n, index) => {

      const marginBetween = 1 * index
      const otherRadius = index * lineWidth

      return firstRadius - otherRadius - marginBetween

    })

  }

  handleLineHeight() {

    const { times } = this.settings
    const radiusPerc = times < 5 ? .25 : times > 15 ? .75 : .5
    const halfRadius = (this.x > this.y ? this.x : this.y) * radiusPerc
    const lineWidth = halfRadius / times
    const limit = halfRadius * .2
    this.settings.lineWidth = lineWidth > limit ? limit : lineWidth

  }

}
