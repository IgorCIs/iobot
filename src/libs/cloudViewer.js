import * as THREE from 'three';
import OrbitControlls from 'three-orbitcontrols';
import { OBJLoader } from 'three-obj-mtl-loader';
import MorphCloudShader from './morphCloud';
import DeviceOrientationControls from 'three-device-orientation'; 
import isPhone from './useragent';

// const isSmallSkull = false;

export default class CloudViewer {
  constructor(element, onLoad, color, initialModels, activeProject) {

    this.initialModels = initialModels;
    this.sceneElement = element;
    this.onLoad = onLoad;
    this.activeProject = activeProject


    
    this.MainScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.sceneElement.offsetWidth / this.sceneElement.offsetHeight , 0.1, 1000 );
    
    this.controls = new OrbitControlls(this.camera, this.sceneElement);
    this.renderer = new THREE.WebGLRenderer({ alpha: !color });
    this.camera.position.set(3, 32, 91);
    this.camera.position.multiplyScalar(0.4);

    if ( color ) {
      this.setColor(color);
    }



    this.cameraHolder = new THREE.Object3D();
    this.cameraHolder.add( this.camera );

    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.sceneElement.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight);    

    this.mouseNormal = new THREE.Vector2();

    this.controls.update() ;
    this.render();

    this.MainScene.add(this.cameraHolder);

    this.MeshControllers = [];

    this.controls.enabled = false;

    this.enabled = true;


    this.initMouse();
    this.loadModel(this.initialModels[0], onLoad)
    this.initResizer();
  }

  initResizer(){

    window.addEventListener( 'resize', ()  => {
      this.renderer.setSize(this.sceneElement.offsetWidth, this.sceneElement.offsetHeight );
      this.camera.aspect = this.sceneElement.offsetWidth / this.sceneElement.offsetHeight;
      this.camera.updateProjectionMatrix();
    });

  }

  setColor(color) {
    this.renderer.setClearColor( color );
  }

  loadModel(model, onLoad) {
    this.clearAllMeshControllers()
    return new Promise((resolve, reject) => {
      this.obj_loader = new OBJLoader();
        this.obj_loader.load( model, ( object ) => {
          let vertices = [];

          const DEFAULT_RADIUS_ASPECT = 22.465094820192128;
          const defaultCenter = new THREE.Vector3().fromArray(  [ -0.0002498626708984375, -0.7617001533508301, 13.81304956227541 ] );
          const boundingSphere = new THREE.Box3().expandByObject( object ).getBoundingSphere( new THREE.Sphere() );

          const targetRadiusAspect = DEFAULT_RADIUS_ASPECT / boundingSphere.radius;
          const targetCenterOffset = defaultCenter.sub( boundingSphere.center );

          console.log('model: ' + model.split('./models/')[1], boundingSphere);
          
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
          console.log( targetCenterOffset );
          for (const nextVer of vertices) {
            nextVer.multiplyScalar(targetRadiusAspect);
            nextVer.add( targetCenterOffset );
          }
          this.initShader( vertices, onLoad );
          
          resolve( vertices );
        });
      }
    )
  }
  
  initShader( model, onLoad ) {
    this.modelGeometry = model;

    
    const ShadedMeshController = new MorphCloudShader({
      pathCount: 8,
      vertices: this.modelGeometry
    });

    ShadedMeshController.shaderGeometry.rotateX( -Math.PI / 2);
    ShadedMeshController.shaderGeometry.translate( 0, -10, 0 );

    this.MainScene.add( ShadedMeshController.shaderMesh );

    if(isPhone()) ShadedMeshController.deviceOrientControll = new DeviceOrientationControls(new THREE.Object3D());
    ShadedMeshController.defaultQ = ShadedMeshController.shaderMesh.quaternion.clone();
    
    this.MeshControllers.push( ShadedMeshController );

    setTimeout(() => onLoad(true), 1000);
  }

  clearAllMeshControllers(){
    for( const nextController of this.MeshControllers ){
      nextController.remove();
    }
    this.MeshControllers = [];
    this.modelGeometry = [];
  }

  renderAction() {

    this.renderer.render( this.MainScene, this.camera );

    for( const MainMesh of this.MeshControllers ) {
        if(MainMesh.deviceOrientControll) {
          
          MainMesh.deviceOrientControll.update();
          MainMesh.shaderMesh.quaternion.copy(MainMesh.defaultQ.clone().slerp(MainMesh.deviceOrientControll.object.quaternion.clone(), 0.15 )) 

        }
        

        MainMesh.updateMouseNormal( this.mouseNormal );
        MainMesh.animate();
        const toSinFunc = ( alpha ) => Math.sin( Math.PI / 2 * alpha )
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
    if(!isPhone()) {
      document.body.addEventListener('mousemove', (e) => {
        if( this.enabled ){
          const mp = { x: e.pageX, y: e.pageY };
          const wp = { w: this.sceneElement.offsetWidth, h: this.sceneElement.offsetHeight };
          const currentMouseNormal = new THREE.Vector2( -1.0 + ( mp.x / wp.w * 2.0  ), 1.0 - ( mp.y / wp.h * 2.0 ) );
            
          this.mouseNormal.copy( currentMouseNormal );
        }
      });
    }
      
    
    window.addEventListener("deviceorientation", (e) => {
      if( this.enabled ){
        // const gp = {
        //   x: e.alpha,
        //   y: e.beta
        // }       

        // const currentGyroNormal = new THREE.Vector2( gp.x / 180, -gp.y / 180 );

        // this.mouseNormal.copy( currentGyroNormal )
      }
    }, false)
  }

}
