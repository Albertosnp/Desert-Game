import { GameObjects } from "phaser"

export default class Bonus extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)
    this.width = 300
    this.height = 200
    this.depth = 100
    this.x = 400
    this.y = 0
    this.alpha = 0
    
    
    //const backgroundColor = new GameObjects.Rectangle(scene, 5, 0, 200, 150, 0xFFFFFF, 0.7)
    this.rectangleBack = new GameObjects.Rectangle(scene, 0, 0, 300, 200, 0x00000, 0.8)
    this.rectangleBack.setStrokeStyle(2, 0xffffff, 0.8)                      
    //Textos
    this.titleBonus = new GameObjects.Text(scene, 0, -40, '', styleOfTitle).setOrigin(0.5, 0)
    this.totalAward = new GameObjects.Text(scene, 0, 20, '', styleOfAward).setOrigin(0.5, 0)
    
    //se añaden al container
    this.add(this.rectangleBack)
    this.add(this.titleBonus)
    this.add(this.totalAward)

    this.scene.add.existing(this)
  }

  changeBonusText(bonus, award) {
    const ganancia = award - (award / bonus) 
    this.titleBonus.setText(`Bonus x${bonus}`)
    this.totalAward.setText(`Premio: ${ganancia}`)
  }

  show() {
    this.scene.bonusFilter.setVisible(true)
    this.setVisible(true)

    if (this.effectDown) {
      this.effectDown.stop(0)
      this.effectDown.remove()
      this.effectScale.stop(0)
      this.effectScale.remove()
      this.setY(0)
      this.setAlpha(0)
    }
   /*  if (condition) {
      
    } */
    this.setScale(1)
    this.effectScale = this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      duration: 400,
      ease: 'Linear',
      paused:true
    })
  
    this.effectDown = this.scene.tweens.add({
      targets: this,
      y: 300,
      x: 400,
      alpha: 1,
      duration: 400,
      ease: 'Linear',
      onComplete: () => {
        this.effectScale.play()
      }
    })

  }

  hide() {
    this.alpha = 0
  }
}
const styleOfAward = {
  font: 'bold 25px Lora',
  fill: '#fff',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}
const styleOfTitle = {
  font: 'bold 35px Lora',
  fill: '#fff',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
}
