import * as THREE from 'three'
import OrbitControlls from 'three-orbitcontrols'
import { OBJLoader } from 'three-obj-mtl-loader'
import MorphCloudShader from './morphCloud'
import __object from './../media/skull.obj'

console.log(__object)

export default class CloudViewer {
  constructor(element, onLoad) {
    this.sceneElement = element
    this.onLoad = onLoad

    this.MainScene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, this.sceneElement.offsetWidth / this.sceneElement.offsetHeight , 0.1, 1000 );

    this.controls = new OrbitControlls(this.camera, this.sceneElement)
    this.renderer = new THREE.WebGLRenderer()
    this.camera.position.set(3, 32, 91)
    this.camera.position.multiplyScalar(0.4)

    this.cameraHolder = new THREE.Object3D();
    this.cameraHolder.add( this.camera );


    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( '#000000' )   

    this.sceneElement.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);    

    this.mouseNormal = new THREE.Vector2()

    this.controls.update() 
    this.render()
  
    this.MainScene.add(this.cameraHolder)

    this.controls.enabled = false
    
    this.initMouse()
    this.initShader()
  }

  loadModel() {
    return new Promise((resolve, reject) => {
    this.obj_loader = new OBJLoader();
      this.obj_loader.load( __object, ( object ) => {
        let vertices = [];
        object.traverse( ( nextObject ) => {
          if ( nextObject.isMesh ) {
              if ( nextObject.geometry ) {
                if ( nextObject.geometry.type === 'BufferGeometry' ) {
                  let nextGeometry = new THREE.Geometry().fromBufferGeometry( nextObject.geometry );
                  vertices = vertices.concat( nextGeometry.vertices );
                }
              }
          }

        });
        // console.log( vertices );
        resolve( vertices );
      });
    })
  }

  initShader() {
    this.loadModel().then(( model ) => {
      // console.log(model)
      this.modelGeometry = model;
      // this.modelGeometry

      this.MainMesh = new MorphCloudShader({
        pathCount: 16,
        vertices: this.modelGeometry
      })
      
      this.MainMesh.shaderGeometry.rotateX( -Math.PI / 2);
      this.MainMesh.shaderGeometry.translate( 0, -10, 0 )
      this.MainScene.add( this.MainMesh.shaderMesh )

      setTimeout(() => {
        this.onLoad()
      }, 1000);
    })
  }
    
  render() {
    requestAnimationFrame(() => this.render())
    this.renderer.render(this.MainScene, this.camera)

    // this.controls.update()

    if (this.MainMesh) {
      this.MainMesh.updateMouseNormal(this.mouseNormal)
      this.MainMesh.animate()
    }
  }

  initMouse() {
     
    this.sceneElement.addEventListener('mousemove', (e) => {
      const mp = {
        x: e.pageX,
        y: e.pageY,
      }
      const wp = {
        w: this.sceneElement.offsetWidth,
        h: this.sceneElement.offsetHeight,
      };

      const currentMouseNormal = new THREE.Vector2(
        1.0 - ( mp.x / wp.w * 2.0  ),
        1.0 - ( mp.y / wp.h * 2.0 )
      );
      currentMouseNormal.x = -currentMouseNormal.x;
      this.mouseNormal.copy(currentMouseNormal)

      const toSinFunc = ( alpha )=> {
        return Math.sin( Math.PI / 2 * alpha );
      }
      const translateFactor = Math.PI / 2;      
      this.cameraHolder.rotation.x = 0 + toSinFunc( currentMouseNormal.y ) * translateFactor * 0.2;
      this.cameraHolder.rotation.y = 0 + -toSinFunc( currentMouseNormal.x ) * translateFactor * 0.3;
    })
  }
}