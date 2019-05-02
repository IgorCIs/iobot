import * as THREE from 'three';
import OrbitControlls from 'three-orbitcontrols';
import { OBJLoader } from 'three-obj-mtl-loader';
import MorphCloudShader from './morphCloud';
import __object from './../media/skull.obj';
import __object_small from './../media/skull2.obj';

const isSmallSkull = false;

export default class CloudViewer {
  constructor(element, onLoad, color) {

    this.sceneElement = element;
    this.onLoad = onLoad;

    this.MainScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.sceneElement.offsetWidth / this.sceneElement.offsetHeight , 0.1, 1000 );

    this.controls = new OrbitControlls(this.camera, this.sceneElement);
    this.renderer = new THREE.WebGLRenderer();
    this.camera.position.set(3, 32, 91);
    this.camera.position.multiplyScalar(0.4);

    this.cameraHolder = new THREE.Object3D();
    this.cameraHolder.add( this.camera );

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( color );

    this.sceneElement.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);    

    this.mouseNormal = new THREE.Vector2();

    this.controls.update() ;
    this.render();

    this.MainScene.add(this.cameraHolder);

    this.MeshControllers = [];

    this.controls.enabled = false;

    this.enabled = true;

    console.log( this );

    this.initMouse();
    this.initShader();
    this.initResizer();
  }

  initResizer(){

    window.addEventListener( 'resize', ()  => {
      this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight );
      this.camera.aspect = this.sceneElement.offsetWidth / this.sceneElement.offsetHeight;
      this.camera.updateProjectionMatrix();
    });

  }

  loadModel() {

    return new Promise((resolve, reject) => {

    this.obj_loader = new OBJLoader();

      const modelForLoad = isSmallSkull ? __object_small : __object;

      this.obj_loader.load( modelForLoad, ( object ) => {
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

      // this.MainMesh = new MorphCloudShader({
      const ShadedMeshController = new MorphCloudShader({
        pathCount: 8,
        vertices: this.modelGeometry
      });
      ShadedMeshController.shaderGeometry.rotateX( -Math.PI / 2);
      ShadedMeshController.shaderGeometry.translate( 0, -10, 0 );

      this.MainScene.add( ShadedMeshController.shaderMesh );

      this.MeshControllers.push( ShadedMeshController );

      setTimeout(() => { this.onLoad(); }, 1000);

    })
  }

  clearAllMeshControllers(){
    for( const nextController of this.MeshControllers ){
      nextController.remove();
    }
    this.MeshControllers = [];
    this.modelGeometry = [];
  }

  renderAction(){

    this.renderer.render( this.MainScene, this.camera );

    for( const MainMesh of this.MeshControllers ){
        MainMesh.updateMouseNormal( this.mouseNormal );
        MainMesh.animate();
        const toSinFunc = ( alpha )=> { return Math.sin( Math.PI / 2 * alpha ); };
        const translateFactor = Math.PI / 2;
        this.cameraHolder.rotation.x = 0 + toSinFunc( MainMesh.mouseOldestPosition.y ) * translateFactor * 0.2;
        this.cameraHolder.rotation.y = 0 + -toSinFunc( MainMesh.mouseOldestPosition.x ) * translateFactor * 0.3;
    }
    // this.controls.update()

  }

  render() {
    requestAnimationFrame(() => this.render());
    if( this.enabled ){ this.renderAction(); }
  }

  initMouse() {
    document.body.addEventListener('mousemove', (e) => {
        if( this.enabled ){
            const mp = { x: e.pageX, y: e.pageY };
            const wp = { w: this.sceneElement.offsetWidth, h: this.sceneElement.offsetHeight };
            const currentMouseNormal = new THREE.Vector2( -1.0 + ( mp.x / wp.w * 2.0  ), 1.0 - ( mp.y / wp.h * 2.0 ) );
            this.mouseNormal.copy( currentMouseNormal );
        }
    });
  }

}
