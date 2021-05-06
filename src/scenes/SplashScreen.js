import Phaser from 'phaser'

export default class SplashScreen extends Phaser.Scene {
  constructor(){
    super({key: 'SplashScreen'})
  }

  preload() {

  }

  init() {
    
  }

  create(){
    //Boton play
    this.screen = this.add.image(400, 300, 'splash').setDisplaySize(800, 600)
    

    this.title = this.add.text(400, 200, 'DESERT GAME', styleOfTitle).setOrigin(0.5)
    this.title.setShadow(3, 3, 'rgba(0,0,0,6)', 2).setOrigin(0.5)
    
    //Boton en escucha de intro
    this.input.keyboard.on('keydown', (event) => {
      event.key === 'Enter' && this.scene.start('MyGame')
    })
    
    this.button = this.add.image(400, 360, 'button').setOrigin(0.5).setDisplaySize(150, 150)
    this.button.setInteractive()
    this.button.on('pointerdown', () => {
      this.scene.stop(this)
      this.scene.start('MyGame')
    })
    
  }

  update() {}
}

const styleOfTitle = {
  font: 'bold 50px Lora',
  fill: '#fff',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}