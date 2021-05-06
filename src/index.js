import Phaser, { CANVAS, GameObjects, Geom } from 'phaser'
import Bonus from './bonus/Bonus'
import Preloading from './scenes/Preloading'
import SplashScreen from './scenes/SplashScreen'

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MyGame'})
  }

  preload() {}

  init() {
    this.score = 0
    this.firstSpin = true
    this.images = {
      1: {
        texture: 'limon',
        award: 1,
      },
      2: {
        texture: 'campana',
        award: 2,
      },
      3: {
        texture: 'naranja',
        award: 0,
      },
      4: {
        texture: 'uvas',
        award: 0,
      },
      5: {
        texture: 'bonus',
        award: 0,
        bonus: true,
      },
    }
  }

  create() {
    //Sound intro
    this.sound.add('intro').play()

    const screen = this.add.image(400, 300, 'sky')
    this.title = this.add.text(400, 60, 'DESERT GAME', styleOfTitle).setShadow(3, 3, 'rgba(0,0,0,6)', 2).setOrigin(0.5)

    this.bonusContainer = new Bonus(this, 400, 300)
    //TODO... ¿integrar en la clase Bonus?
    this.multiplier = this.add.text(450, 150, '', styleOfBonus).setVisible(true).setShadow(3, 3, 'rgba(0,0,0,6)', 2)

    this.title.setTint(0xffffff, 0xfaff00, 0xfaff00, 0xffffff)
    this.animateTitle()

    this.imageRandom = this.add
      .image(400, 300, '')
      .setOrigin(0.5)
      .setDisplaySize(150, 150)
      .setName('')
      .setVisible(false)

    //Boton en escucha de intro
    this.input.keyboard.on('keydown', (event) => {
      event.key === 'Enter' && this.onClick()
    })
    //Boton play
    this.button = this.add.image(400, 490, 'button').setOrigin(0.5).setDisplaySize(150, 150)
    this.button.setInteractive()
    this.button.on('pointerdown', () => this.onClick())

    this.shadowCofreCerrado = this.add.image(402, 322, 'cofreCerrado').setOrigin(0.5).setDisplaySize(180, 125)
    this.shadowCofreCerrado.anchor = 0.9
    this.shadowCofreCerrado.tint = 0x000000
    this.shadowCofreCerrado.alpha = 0.2
    this.cofreCerrado = this.add.image(400, 320, 'cofreCerrado').setOrigin(0.5).setDisplaySize(170, 120)

    this.shadowCofreAbierto = this.add
      .image(400, 322, 'cofreAbierto')
      .setOrigin(0.5)
      .setDisplaySize(180, 125)
      .setVisible(false)
    this.shadowCofreAbierto.anchor = 0.9
    this.shadowCofreAbierto.tint = 0x000000
    this.shadowCofreAbierto.alpha = 0.2
    this.cofreAbierto = this.add
      .image(400, 320, 'cofreAbierto')
      .setOrigin(0.5)
      .setDisplaySize(170, 120)
      .setVisible(false)

    //Text that contains gamer´s score
    this.scoreText = this.add
      .text(600, 490, `SCORE: ${this.score}`, styleOfScore)
      .setShadow(3, 3, 'rgba(0,0,0,6)', 2)
      .setOrigin(0.5)

    //Sounds
    this.soundWin = this.sound.add('win')
    this.soundPressButton = this.sound.add('pressButton')
    this.soundBonus = this.sound.add('bonus')

    //bonusFilter 
    this.bonusFilter = this.add.rectangle( 400, 300, 800, 600, 0x000000, 0.6).setDepth(50)
    this.bonusFilter.setVisible(false)
  }

  update() {}

  /**
   *
   * @param {object} item
   */
  createImageRandom(item) {
    if (item) {
      this.imageRandom.setTexture(item.texture)
      this.imageRandom.setDisplaySize(150, 150)
      this.imageRandom.setName(item.texture)
      this.imageRandom.setVisible(true)
    }
  }

  createAnimationCofreAbierto() {
    if (this.animationCofreAbierto) {
      this.animationCofreAbierto.stop(0)
      this.animationCofreAbierto.remove()
      this.cofreAbierto.setY(320)
      this.shadowCofreAbierto.setY(320)
    }

    this.animationCofreAbierto = this.tweens.add({
      targets: [this.cofreAbierto, this.shadowCofreAbierto],
      y: 350,
      duration: 600,
      ease: 'Elastic',
    })
  }

  createAnimationCofreCerrado() {
    let destX = 400
    this.firstSpin = false
    this.animationCofreCerrado = this.tweens.add({
      targets: [this.cofreCerrado, this.shadowCofreCerrado],
      duration: 300,
      yoyo: true,
      repeat: 2,
      ease: 'Linear',
      x: {
        getEnd: (target, key, value) => {
          destX -= 10

          return destX
        },

        getStart: (target, key, value) => {
          return value + 10
        },
      },
      onComplete: () => {
        this.executeGame()
        this.shadowCofreCerrado.visible = false
        this.cofreCerrado.visible = false
        this.animationCofreCerrado.remove()
      },
    })
  }

  createAnimationFigurePremiated() {
    if (this.animationPremiated) {
      this.animationPremiated.stop(0)
      this.animationPremiated.remove()
      this.imageRandom.setY(300)
    }

    this.animationPremiated = this.tweens.add({
      targets: this.imageRandom,
      y: 200,
      duration: 600,
      ease: 'Bounce',
    })
  }

  animateTitle() {
    this.tweens.add({
      targets: this.title,
      ease: 'Elastic',
      scale: 1.3,
      duration: 2000,
    })
  }

  animateScore() {
    this.tweens.add({
      targets: this.scoreText,
      ease: 'Linear',
      scale: 1.3,
      duration: 600,
      yoyo: true,
      onUpdate: () => {
        this.scoreText.setColor('yellow')
      },
      onComplete: () => {
        this.scoreText.setColor('white')
      },
    })
  }

  resetFigure() {
    if (this.animationBack) {
      this.animationBack.stop(0)
      this.animationBack.remove()
      this.imageRandom.setRotation(0)
      this.imageRandom.setY(300)
    }
    if (this.animation) {
      this.animation.stop(0)
      this.animation.remove()
    }
  }

  //Animacion de "tambaleo" despues de girar 360
  animateFigure() {
    this.resetFigure()

    this.animationBack = this.tweens.add({
      targets: this.imageRandom,
      rotation: -0.9,
      duration: 125,
      ease: 'Linear',
      yoyo: true,
      paused: true,
      onComplete: () => {
        this.button.input.enabled = true
        this.input.keyboard.enabled = true
      },
    })

    this.animation = this.tweens.add({
      targets: this.imageRandom,
      rotation: 0.9,
      duration: 125,
      ease: 'Linear',
      yoyo: true,
      //paused: true,
      onComplete: () => {
        this.animationBack.play()
      },
    })
  }

  //Animacion que hace girar el simbolo 360º
  createAnimationImageExit() {
    if (this.animationImageExit) {
      this.imageRandom.setRotation(0)
      this.imageRandom.setY(300)
      this.imageRandom.setDisplaySize(150, 150)
      this.animationImageExit.remove()
    }
    //Para reescalar la imagen de bonus
    const isDollar = this.imageRandom.texture.key === 'bonus'

    this.animationImageExit = this.tweens.add({
      targets: this.imageRandom,
      rotation: 360,
      scale: isDollar ? 0.07 : 0.4,
      duration: this.firstSpin ? 0 : 500,
      ease: 'Elastic',
      yoyo: true,

      onComplete: () => {
        this.resetFigure()
        this.executeGame()
      },
    })
  }

  createAnimationBonusMultiplier(multiplied) {
    if (this.animationBonusMultiplier) {
      this.multiplier.setPosition(450, 150)
      this.animationBonusMultiplier.remove()
    }
    this.animationBonusMultiplier = this.tweens.add({
      targets: this.multiplier,
      x: 470,
      y: 120,
      scale: 1.2,
      duration: 300,
      ease: 'Elastic',
      onComplete: () => {
        this.bonusContainer.changeBonusText(multiplied, this.score)
        this.bonusContainer.show()
        this.button.input.enabled = true
        this.input.keyboard.enabled = true
      },
    })
  }

  executeGame() {
    let item
    let random
    while (!item) {
      random = Phaser.Math.Between(1, 5)
      item = this.images[random]
    }
    this.createImageRandom(item)

    const isPremiated = this.checkPremiated(item)

    const multiplied = this.checkBonus(item)
    if (multiplied) {
      this.multiplier.setText(`x${multiplied}`)
      this.multiplier.setVisible(true)
      this.createAnimationBonusMultiplier(multiplied)
      //this.createAnimationContainerBonus()
    } else {
      this.animateFigure()
    }

    //this.button.input.enabled = true
    this.button.clearTint()
  }

  checkBonus(item) {
    if (this.score === 0) return false

    const isBonus = item.bonus
    let multiplied = 0
    if (isBonus) {
      multiplied = Phaser.Math.Between(2, 4)
      this.score *= multiplied
      this.soundBonus.play()
      this.scoreText.setText(`SCORE: ${this.score}`)
      this.animateScore()
    }
    return multiplied
  }

  checkPremiated(item) {
    const isPremiated = item.award > 0
    if (isPremiated) {
      this.soundWin.play()
      this.cofreAbierto.setVisible(true)
      this.shadowCofreAbierto.setVisible(true)
      this.createAnimationCofreAbierto()
      this.createAnimationFigurePremiated()
      this.animateScore()
      this.score = this.score += item.award
    }
    this.scoreText.setText(`SCORE: ${this.score}`)

    return isPremiated
  }

  onClick() {
    this.bonusFilter.setVisible(false)
    this.bonusContainer.hide()
    this.soundPressButton.play()
    this.multiplier.setVisible(false)
    this.input.keyboard.enabled = false
    this.button.input.enabled = false
    this.button.setTint(0x919191)
    this.cofreAbierto.setVisible(false)
    this.shadowCofreAbierto.setVisible(false)

    if (!this.animationCofreCerrado) this.createAnimationCofreCerrado()
    else {
      this.createAnimationImageExit()
    }
  }
}

const styleOfScore = {
  font: 'bold 35px Lora',
  fill: '#fff',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}

const styleOfTitle = {
  font: 'bold 50px Lora',
  fill: '#fff',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}
const styleOfBonus = {
  font: 'bold 50px Lora',
  fill: 'yellow',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: [Preloading, SplashScreen, MyGame ]
}

const game = new Phaser.Game(config)
