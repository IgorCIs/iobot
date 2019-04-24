import * as THREE from 'three'
import ImageSwitcherMesh from './image-switcher'
import OrbitControlls from 'three-orbitcontrols'

class Viewer {
  constructor (element, orImages) {
    this.clientImages = orImages
    this.sceneElement = element
    this.MainScene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, this.sceneElement.offsetWidth / this.sceneElement.offsetHeight , 0.1, 1000 );
    this.controlls = new OrbitControlls(this.camera, this.sceneElement)
    this.renderer = new THREE.WebGLRenderer()
    this.camera.position.set(0, 100, -0.001)
    
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0xdddddd );
    
    const lightA = new THREE.AmbientLight(0xffffff, 1.0 );
    this.MainScene.add( lightA );
    
    const light = new THREE.DirectionalLight(0xffffff, 1.0 )
    
    light.position.set( 1, 1, -1 );
    
    this.MainScene.add(light)
    
    this.sceneElement.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
  
    this.initShader()
    
    this.render()
  }
    
  render() {
    requestAnimationFrame(() => this.render())
    this.controlls.update()
    this.renderer.render(this.MainScene, this.camera)
    
    
  }
    
  async initShader () {
    const ImageSwitcher = new ImageSwitcherMesh()
    this.ImageSwitcher = ImageSwitcher

    const images = [...this.clientImages, require('./../media/distortionMap.jpg')]
      .map(item => {
        if(!item.src) {
          const img = new Image()
          img.src = item 
          item = img
        }

        return new Promise((resolve, reject) => {
          item.onload = () => resolve(item)
        })
      })
    
    await ImageSwitcher.init({
      image1: await images[2],
      image2: await images[1],
      distortionMap: await images[images.length - 1],
      mixAlpha: 0,
      geometry: [40, 40, 70, 70]
    })    
  
    this.MainScene.add(ImageSwitcher.shaderPlane)
  }

  changeImage() {
    animateMixAlpha(this.ImageSwitcher.setMixAlpha.bind(this.ImageSwitcher))  
    // console.log(
    //   this.controlls.getAzimuthalAngle(), '    ',
    //   this.controlls.getPolarAngle(),
      
    // )
  }
}

const animateMixAlpha = cb => {
  const alpha = 0.01
  let value = 0

  requestAnimationFrame(async function animate(time) {
    cb(value += alpha)
    
    if(value + alpha < 1) requestAnimationFrame(animate) 
  })
}
export {
  Viewer
}