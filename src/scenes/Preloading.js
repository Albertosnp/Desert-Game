import Phaser, { CANVAS, Geom } from 'phaser'

export default class Preloading extends Phaser.Scene {
  constructor(){
    super({key: 'Preloading'})
  }

  preload() {
    let progressBar = this.add.graphics()
    let progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)
    let width = this.cameras.main.width
    let height = this.cameras.main.height
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: `Loading...`,
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    })
    loadingText.setOrigin(0.5, 0.5)
    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    })
    assetText.setOrigin(0.5, 0.5)

    this.load.on('progress', (value) => {
      //console.log(value)
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(250, 280, 300 * value, 30)
    })

    this.load.on('fileprogress', (file) => {
      //console.log(file)
      assetText.setText(`Loading asset: ${file.key}`)
    })

    this.load.on('complete', () => {
      // console.log('complete')
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      assetText.destroy()
    })
    this.load.image('splash', 'src/assets/splash.jpg')
    this.load.image('sky', 'src/assets/original.jpg')
    this.load.image('limon', 'src/assets/1.png')
    this.load.image('campana', 'src/assets/2.png')
    this.load.image('naranja', 'src/assets/3.png')
    this.load.image('uvas', 'src/assets/4.png')
    this.load.image('button', 'src/assets/play.png')
    this.load.image('cofreCerrado', 'src/assets/cofreCerrado.png')
    this.load.image('cofreAbierto', 'src/assets/cofreAbierto.png')
    this.load.image('bonus', 'src/assets/dollar.png')
    this.load.image('backBonus', 'src/assets/backBonus.png')
    this.load.audio('win', 'src/assets/audio/ping.mp3')
    this.load.audio('intro', 'src/assets/audio/intro.mp3')
    this.load.audio('pressButton', 'src/assets/audio/pressButton.mp3')
    this.load.audio('bonus', 'src/assets/audio/bonus.mp3')
  }

  init() {
    
  }

  create(){
    this.scene.stop(this)
    this.scene.start('SplashScreen')
  }

  update() {

  }
}