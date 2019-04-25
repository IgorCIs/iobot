import * as THREE from 'three'
import ImageSwitcherMesh from './image-switcher'
import OrbitControlls from 'three-orbitcontrols'

class Viewer {
  constructor (element, orImages, color, widthratio = false) {
    
    this.widthratio = widthratio
    this.currentImage = 0
    this.clientImages = orImages
    this.sceneElement = element
    this.MainScene = new THREE.Scene();
    this.cameraHolder = new THREE.Object3D();
    this.MainScene.add( this.cameraHolder );
    this.camera = new THREE.PerspectiveCamera(60, this.sceneElement.offsetWidth / this.sceneElement.offsetHeight , 0.1, 1000 );
    this.controlls = new OrbitControlls(this.camera, this.sceneElement)
    this.renderer = new THREE.WebGLRenderer()
    this.camera.position.set(0, 100, 0.001);
    this.cameraHolder.add( this.camera );
    this.controlls.update();

    
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( color );
    
    const lightA = new THREE.AmbientLight(0xffffff, 1.0 );
    this.MainScene.add( lightA );
    
    const light = new THREE.DirectionalLight(0xffffff, 1.0 )
    
    light.position.set( 1, 1, -1 );
    
    this.MainScene.add(light)
    
    this.sceneElement.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
  
    this.initShader()
    
    this.render()

    this.controlls.enabled = false;
    
    document.addEventListener('mousemove', (e) => {
      this.mp = {
        x: e.pageX,
        y: e.pageY,
      }
      this.mouseMover() 
      this.camera.updateProjectionMatrix();
      // this.controlls.update()
    })
  }
   
  setWidths() {
    const width =  this.sceneElement.offsetWidth / this.sceneElement.offsetHeight
    
    if(this.camera.aspect !== width) {
      this.camera.aspect = this.sceneElement.offsetWidth / this.sceneElement.offsetHeight
      this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);
      this.camera.updateProjectionMatrix();
      
    }
    if(this.camera.zoom !== this.camera.aspect / 2.0) {
      this.camera.zoom = this.camera.aspect / 2.0;
      this.camera.updateProjectionMatrix();
    }
  }

  setColor(color) {
    this.renderer.setClearColor( color );
  }
  
  render() {
    requestAnimationFrame(() => this.render())
    this.renderer.render(this.MainScene, this.camera)

    this.setWidths()
  }
    
  async initShader () {
    const ImageSwitcher = new ImageSwitcherMesh()
    this.ImageSwitcher = ImageSwitcher

    // this.images = [...this.clientImages ]
    //   .map(item => {
    //     return new Promise((resolve, reject) => {
    //       item.onload = () => resolve(item)
    //     })
    //   })

    this.distortionMap = () => {
      const map = require('./../media/distortionMap.jpg')
      const img = new Image()
      img.src = map
      
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
      })
    } 
    
    this.lastImage = this.clientImages[0] 
      
    await ImageSwitcher.init({
      image1: this.clientImages[0],
      image2: this.clientImages[0],
      distortionMap: await this.distortionMap(),
      mixAlpha: 1,
      geometry: [30, 30, 50, 50]
    })    

    this.MainScene.add(ImageSwitcher.shaderPlane)

  }

  mouseMover() {
    
    const wp = {
        w: this.sceneElement.offsetWidth,
        h: this.sceneElement.offsetHeight,
    };

    const currentMouseNormal = new THREE.Vector2(
        1.0 - ( this.mp.x / wp.w * 2.0  ),
        1.0 - ( this.mp.y / wp.h * 2.0 )
    );
    currentMouseNormal.negate();
    
    const toSinFunc = ( alpha )=> {
      return Math.sin( Math.PI / 2 * alpha );
    }

    const translateFactor = Math.PI/2;
    this.cameraHolder.rotation.x = 0 + toSinFunc( currentMouseNormal.y ) * translateFactor * 0.2;
    this.cameraHolder.rotation.z = 0 + toSinFunc( currentMouseNormal.x ) * translateFactor * 0.1;
  }
  
  async setImage(image) {
    const lastimg = this.lastImage
    // const img = new Promise((resolve, reject) => {
    //   console.log(image)
    //   resolve(image)
    // })
    // const newImg = await img
    
    if (lastimg.src !== image.src) {
      await this.ImageSwitcher.setTexture1(image)
      await this.ImageSwitcher.setTexture2(image)
      this.ImageSwitcher.updateGeometry()
    }
  }

  // nextImage() {
  //   animateMixAlpha(
  //   (i) => {
  //     this.ImageSwitcher.setMixAlpha(i)
  //   },
  //   async () => {
  //     this.currentImage++
  //     await this.ImageSwitcher.setTexture1(await this.images[this.currentImage])
  //     this.ImageSwitcher.setMixAlpha(1)
  //     await this.ImageSwitcher.setTexture2(await this.images[this.currentImage + 1])
  //   }
  //   )  
  // }

  // goToImage() {
    
  // }
}



// const animateMixAlpha = (cb, fcb) => {
//   const alpha = 0.01
//   let value = 1

  
//   requestAnimationFrame(async function animate(time) {
//     cb(value -= alpha)
    
//     if(value - alpha > 0) requestAnimationFrame(animate) 
//     else fcb()
  
//   })
// }

export {
  Viewer
}