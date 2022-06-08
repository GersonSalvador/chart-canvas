class ChartCanvas {

  constructor(settings) {

    this.setConstants()
    this.handleSettings(settings,)
    this.handleCanvasEl()

  }

  setConstants() {

    const margin = [0, 0, 0, 0]

    this.PI = Math.PI
    this.degree = 2 * this.PI / 360
    this.defaultSettings = {
      width: 400,
      height: 400,
      margin,
      maxValue: 100,
      maxDegree: 360 * .85,
      font: {
        style: 'normal',
        variant: 'normal',
        weight: 'normal',
        family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
      },
    }

  }

  handleSettings(settings,) {

    const { defaultSettings } = this
    const { font: defaultFont } = defaultSettings
    const { font: settingsFont, title, subTitle } = settings
    const font = { ...defaultFont, ...settingsFont }

    this.settings = { ...defaultSettings, ...settings, font, }

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

    return color || `hsl(${hue}, 70%, 52%)`

  }

  handleFont(ctx, size, settings) {

    const {
      style,
      variant,
      weight,
      family,
      textAlign,
      textBaseline,
      fillStyle,
    } = { ...this.settings.font, ...settings }

    ctx.font = `${style} ${variant} ${weight} ${size}px ${family}`
    ctx.textAlign = textAlign || 'center'
    ctx.textBaseline = textBaseline || 'middle'
    ctx.fillStyle = fillStyle || '#333'
  }

  handleCanvasEl() {

    const { canvas, width, height } = this.settings

    const canvasElement = document.querySelector(canvas)

    canvasElement.width = width;
    canvasElement.height = height;

    this.canvas = canvasElement

    this.handleContext()

  }

  handleContext() {

    this.ctx = this.canvas.getContext("2d");

  }

  handleXYAxis() {
    const { titleSubMargin } = this
    const { width, height, margin } = this.settings

    this.x = (width + margin[1] - margin[3]) / 2
    this.y = (height + titleSubMargin + margin[0] - margin[2]) / 2
  }

  handleRaduis() {

    const { lineWidth, titleSubMargin } = this
    const { width, height, margin } = this.settings
    const xArea = width - margin[1] - margin[3]
    const yArea = height - margin[0] - margin[2] - titleSubMargin

    const firstRadius = (((xArea < yArea ? xArea : yArea) / 2) - lineWidth / 2)

    this.radius = [...Array(this.times)].map((n, index) => {

      const marginBetween = 1 * index
      const otherRadius = index * lineWidth

      return firstRadius - otherRadius - marginBetween

    })

  }

  handleLineHeight() {

    const { times } = this
    const { width, height } = this.settings
    const radiusPerc = times < 5 ? .5 : .65
    const halfRadius = (width > height ? width : height) / 2 * radiusPerc
    const lineWidth = halfRadius / times
    const limit = halfRadius * .2

    this.lineWidth = lineWidth > limit ? limit : lineWidth

  }

  handleTitle() {

    const { ctx, lineWidth } = this
    const { title, subTitle, width } = this.settings
    let titleSubMargin = 0

    //title 
    if (title) {
      this.handleFont(ctx, lineWidth, { textAlign: 'center', textBaseline: 'top' })
      ctx.fillText(title, width / 2, 0);
      titleSubMargin += lineWidth * 2
    }

    //subTitle
    if (subTitle) {
      const subTitleMargin = lineWidth * 1.4
      this.handleFont(ctx, lineWidth * .65, { fillStyle: '#999', textAlign: 'center', textBaseline: 'top' })
      ctx.fillText(subTitle, width / 2, lineWidth * 1.4);
      titleSubMargin += subTitleMargin
    }
    this.titleSubMargin = titleSubMargin
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

  calcEndOfArc(degree, radius) {

    const x = this.x + Math.cos(degree) * radius;
    const y = this.y + Math.sin(degree) * radius;

    return [x, y]
  }

  calcBaseValue() {

    const base = this.settings.maxDegree / this.settings.maxValue

    this.settings.baseValue = base

  }

  drawTextAlongArc(ctx, str, centerX, centerY, radius, finalValue, lineWidth) {

    const { degree } = this
    const rotate = this.calcRotateStep(radius, lineWidth)
    const len = str.length
    let s

    ctx.save();
    ctx.translate(centerX, centerY);
    this.handleFont(ctx, lineWidth, { family: '-apple-system' })
    ctx.rotate((degree * finalValue) + rotate);

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

    const { ctx, radius, lineWidth, titleSubMargin } = this
    const { margin, value: { prefix, sulfix }, } = this.settings
    const { degree, finalValue } = this.calcDrgree(value)

    ctx.beginPath();
    ctx.strokeStyle = color || this.handleColor();
    ctx.lineWidth = lineWidth;
    ctx.arc(this.x, this.y, radius[index], 1.5 * this.PI, degree);
    ctx.stroke();

    //label
    this.handleFont(ctx, lineWidth * .75, { textAlign: 'end', textBaseline: 'middle' })
    ctx.fillText(label, this.x - margin[3] - margin[1] - (lineWidth * .5), margin[0] + ((index + 1) * (lineWidth + 1)) - (lineWidth * .5) + titleSubMargin);

    //value
    this.drawTextAlongArc(
      ctx,
      `${prefix}${value}${sulfix}`,
      this.x,
      this.y,
      radius[index],
      finalValue,
      lineWidth * .75
    )

  }

  makeIt(values) {

    this.times = values.length
    this.handleLineHeight(values)
    this.handleTitle()
    this.handleRaduis(values)
    this.handleXYAxis()
    this.calcBaseValue()

    values.forEach((v, index) => this.drawCircle(v, index))
  }

}
