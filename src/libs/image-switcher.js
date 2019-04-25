import * as THREE from 'three';


export function ImageSwitcher () {

    const shaderConfig = {

        uniforms: {


            'mixAlpha': { value: 0.0 },
            'image1': { value: null },
            'image2': { value: null },

            'distortion': { value: 15.0 },
            'distortionMap': { value: null },
            'distortionDirection': { value: new THREE.Vector3() },
            'distortionSpeed': { value: 0.0 },
            'distortionScale': { value: 1.0 },

            'greedSizeW': { value: new THREE.Vector2( 15, 15 ) },
            'lineWidth': { value: 0.0 },

            'time': { value: 5.0 },
            'timeScaleFactor': { value:  5.3 },
            'eye': { value: new THREE.Vector3() },
            'resolution': { value: new THREE.Vector2( 4096, 4096 ) },
            'pointSize': { value: 122.0 },
            'textureMatrix': { value: new THREE.Matrix4() },

            'raycastPoint': { value: new THREE.Vector3() },
            'toMouseDistanceMax': { value: 5.0 },

        },

        vertexShader:
            `
            
            // ********* 
            // ********* 
            // specific shader uniforms 
            // ********* 
            // ********* 
           
            uniform float mixAlpha;
            uniform sampler2D image1;
            uniform sampler2D image2;
            
            uniform float distortion;
            uniform sampler2D distortionMap;
            uniform vec3 distortionDirection;
            uniform float distortionSpeed;
            uniform float distortionScale;
            
            uniform vec2 greedSizeW;
            uniform float lineWidth;
            
            // ********* 
            // ********* 
            // default uniforms
            // ********* 
            // ********* 
            uniform float time;
            uniform float timeScaleFactor;
            uniform vec3 eye;
            uniform vec2 resolution;
            uniform float pointSize;
            uniform mat4 textureMatrix;
            
            
            uniform vec3 raycastPoint;
            uniform float toMouseDistanceMax;
           
            // ********* 
            // ********* 
            // varying vars
            // ********* 
            // ********* 
            varying vec2 vUv;
            varying vec4 worldPosition;
            varying float distanceToRaycastPoint;
            
            // ********* 
            // ********* 
            // Utilities 
            // ********* 
            // ********* 
            
            float distanceBetweenVec3( vec3 v1, vec3 v2 ){
                float dx = v1.x - v2.x;
                float dy = v1.y - v2.y;
                float dz = v1.z - v2.z;
                float result = sqrt( dx * dx + dy * dy + dz * dz );
                return result;
            }
            
            float getMod( float a, float b ) {
                float result =  a - ( b * floor( a / b ) );
                return result;
            }
            
            vec4 getMixedColor( sampler2D tex1, sampler2D tex2, vec2 _uv, float alpha ){
                    vec4 mixedColor = ( 
                        texture2D( tex1, _uv ) * alpha + 
                        texture2D( tex2, _uv ) * ( 1.0 - alpha )
                    );
                    return mixedColor;
            }
            
            vec4 getNoise( sampler2D tex1, sampler2D tex2, float _time, vec2 _uv ) {
            
            	vec2 uv0 = ( _uv / 103.0 ) + vec2( _time / 17.0, _time / 29.0);
            	vec2 uv1 = _uv / 107.0-vec2( _time / -19.0, _time / 31.0 );
            	vec2 uv2 = _uv / vec2( 8907.0, 9803.0 ) + vec2( _time / 101.0, _time / 97.0 );
            	vec2 uv3 = _uv / vec2( 1091.0, 1027.0 ) - vec2( _time / 109.0, _time / -113.0 );
            	
            	vec4 noise = texture2D( tex1, uv0 ) +
            		texture2D( tex1, uv1 ) +
            		texture2D( tex1, uv2 ) +
            		texture2D( tex1, uv3 );
            		
            	vec4 noise2 = texture2D( tex2, uv0 ) +
            		texture2D( tex2, uv1 ) +
            		texture2D( tex2, uv2 ) +
            		texture2D( tex2, uv3 );
            		
            	return ( noise + noise2 ) * 0.5 - 2.0;
            	
            }
            
            
            vec4 getDistortionNoize( sampler2D tex1, float _time, vec2 _uv ) {
            
            	vec2 uv0 = ( _uv / 103.0 ) + vec2( _time / 17.0, _time / 29.0);
            	vec2 uv1 = _uv / 107.0-vec2( _time / -19.0, _time / 31.0 );
            	vec2 uv2 = _uv / vec2( 8907.0, 9803.0 ) + vec2( _time / 101.0, _time / 97.0 );
            	vec2 uv3 = _uv / vec2( 1091.0, 1027.0 ) - vec2( _time / 109.0, _time / -113.0 );
            	
            	vec4 noise = texture2D( tex1, uv0 ) +
            		texture2D( tex1, uv1 ) +
            		texture2D( tex1, uv2 ) +
            		texture2D( tex1, uv3 );
            		
            	return ( noise - 0.5 );
            	
            }
            
            vec3 convertToNormal( vec3 src ){
                vec3 nextNormal = vec3(
                     ( 0.5 - src.x ) * 2.0,
                     ( 0.5 - src.y ) * 2.0,
                     ( 0.5 - src.z ) * 2.0
                );
                return nextNormal;
            }
            
            vec2 getTimeScaledUV(){
                return vec2( 
                    getMod( time * timeScaleFactor, 1.0 ), 
                    getMod( time * timeScaleFactor, 1.0 ) 
                );
            }
            
            vec2 getTimeScaledUV2(){                
                vec2 timedModUV = getTimeScaledUV();
                vec2 timedUV = vec2(
                    getMod( vUv.x + timedModUV.x, 1.0 ),
                    getMod( vUv.y + timedModUV.y, 1.0 )
                );
                return timedUV;
            }
            
            // ********* ******************************************************************************************
            // ********* ******************************************************************************************
            // Main 
            // ********* ******************************************************************************************
            // ********* ******************************************************************************************
            
            void main() {
            
                // varying
            	vUv = uv;
            	worldPosition = modelMatrix * vec4( position, 1.0 );
            	distanceToRaycastPoint = distanceBetweenVec3( position, raycastPoint );
            	
            	// const
            	vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
            	vec4 mvStartPosition = mvPosition;
            	
           
                // calculate distance factor for Effect;
                float distanceFactor = 0.2;
                float toMouseDistanceAlpha = sin( distanceToRaycastPoint / toMouseDistanceMax * 1.57 );
                
                // get normalized UV position by Time and Timescale
                vec2 timedModUV = getTimeScaledUV();
                vec2 timedUV = getTimeScaledUV2();
                
                vec2 uvNormal = vec2(
                    ( 1.0 - 2.0 * abs( 0.5 - vUv.y ) ) * 1.57,
                    ( 1.0 - 2.0 * abs( 0.5 - vUv.x ) ) * 1.57
                );
                
                vec4 noize = getDistortionNoize( distortionMap, time, timedUV );
                vec4 currentColor = getMixedColor( image1, image2, vUv, mixAlpha * distortionScale );
                float colorMorphHeight = ( currentColor.x * 2.0 +  currentColor.y * 5.0 +  currentColor.z * 3.0 ) / 6.0;

                // filter for colors weight
                
                vec3 travelMorphVector = vec3( 0.0, colorMorphHeight - noize.y, 0.0 );
                vec4 mvPositionMorphed = vec4( mvPosition.xyz + travelMorphVector, mvPosition.w );
               
               
                // set GLSL vars
                worldPosition = projectionMatrix * mvPositionMorphed;
                gl_Position = worldPosition;
                
            }
        `,

        fragmentShader: `
            
            // ********* 
            // ********* 
            // specific shader uniforms 
            // ********* 
            // ********* 
           
            uniform float mixAlpha;
            uniform sampler2D image1;
            uniform sampler2D image2;
            
            uniform float distortion;
            uniform sampler2D distortionMap;
            uniform vec3 distortionDirection;
            uniform float distortionSpeed;
            uniform float distortionScale;
            
            uniform vec2 greedSizeW;
            uniform float lineWidth;
        
        
            // ********* 
            // ********* 
            // varying vars
            // ********* 
            // ********* 
            varying vec2 vUv;
            varying vec4 worldPosition;
            varying float distanceToRaycastPoint;
            
            // ********* 
            // ********* 
            // Utilities 
            // ********* 
            // ********* 
            float getMod( float a, float b ) {
                float result =  a - ( b * floor( a / b ) );
                return result;
            }
            
            vec4 getMixedColor( sampler2D tex1, sampler2D tex2, vec2 _uv, float alpha ){
                    vec4 mixedColor = ( 
                        texture2D( tex1, _uv ) * alpha + 
                        texture2D( tex2, _uv ) * ( 1.0 - alpha )
                    );
                    return mixedColor;
            }
            
            void main() {
                gl_FragColor = getMixedColor( image1, image2, vUv, mixAlpha );
            }
        `

    };


    return shaderConfig;

}

export default class ImageSwitcherMesh{

    constructor( ){
        

        // define vars
        this.config = {
            geometry: [ 10, 10, 10, 10 ],
            mixAlpha: 0,
            image1: null,
            image2: null,
            distortionMap: null
        };

        this.canvas1 = document.createElement('canvas' );
        this.canvas2 = document.createElement('canvas' );
        this.canvasDistortion = document.createElement('canvas' );
    
        this.texture1 = new THREE.Texture();
        this.texture2 = new THREE.Texture();
        this.distortionMap = new THREE.Texture();
    
        this.shaderPlane = false;
        this.shaderMaterial = false;
        this.shaderForMaterial = false;
    
        this.raycaster = new THREE.Raycaster();
    }


    updateGeometry(update) {
        const { config } = this
        const nextGeometryParams = [];

        nextGeometryParams[ 0 ] = this.image1.width / 10;
        nextGeometryParams[ 1 ] =  this.image1.height / 10;
        
        const aspect = nextGeometryParams[ 0 ] / nextGeometryParams[ 1 ];
        const segmentStandardCount = 20;

        nextGeometryParams[ 2 ] = Math.floor(  segmentStandardCount * aspect );
        nextGeometryParams[ 3 ] = Math.floor(  segmentStandardCount );
        
        config.geometry = nextGeometryParams;

        this.nextPlaneGeometry = new THREE.PlaneGeometry(config.geometry[0], config.geometry[1], config.geometry[2], config.geometry[3]);
        this.nextPlaneGeometry.rotateX(-Math.PI / 2 );

        if(update ) {
            this.shaderPlane = new THREE.Mesh(this.nextPlaneGeometry, this.shaderMaterial);
        } else {
            this.shaderPlane.geometry.dispose()
            this.shaderPlane.geometry = this.nextPlaneGeometry
            console.log(this.shaderPlane.geometry)
        }
        // console.log(this.shaderPlane.geometry.parameters)
       
    }
    
    async init( _config ){
        const config = {...this.config, ..._config};
        this.config = config
        
        try {
            
            this.shaderForMaterial = ImageSwitcher();

        
            await Promise.all([
                this.setTexture1( config.image1 ),
                this.setTexture2( config.image2 ),
                this.setDistortionMap( config.distortionMap )
            ]);


            // set value
            this.shaderForMaterial.uniforms.mixAlpha.value = config.mixAlpha;
            this.texture1.image = this.canvas1;
            this.shaderForMaterial.uniforms.image1.value = this.texture1;
            this.texture1.needsUpdate = true;
            this.texture2.image = this.canvas2;
            this.shaderForMaterial.uniforms.image2.value = this.texture2;
            this.texture2.needsUpdate = true;
            this.shaderForMaterial.uniforms.distortion.value = 10;
            this.distortionMap.image = this.canvasDistortion;
            this.shaderForMaterial.uniforms.distortionMap.value = this.distortionMap;
            this.distortionMap.needsUpdate = true;
            this.shaderForMaterial.uniforms.distortionDirection.value = new THREE.Vector3(1, 1, 1);
            this.shaderForMaterial.uniforms.distortionSpeed.value = 1;
            this.shaderForMaterial.uniforms.greedSizeW.value = new THREE.Vector2(160, 160);
            this.shaderForMaterial.uniforms.lineWidth.value = 1;
            this.shaderForMaterial.uniforms.time.value = 0;
            this.shaderForMaterial.uniforms.timeScaleFactor.value = 0.001;
            this.shaderMaterial = new THREE.ShaderMaterial({
                uniforms: this.shaderForMaterial.uniforms,
                vertexShader: this.shaderForMaterial.vertexShader,
                fragmentShader: this.shaderForMaterial.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                wireframe: true
            });
            this.shaderPlane = new THREE.Mesh(this.nextPlaneGeometry, this.shaderMaterial);
            
            this.updateGeometry(true)

        }
        catch (error) {
            console.log(error);
        }

    }

    setMixAlpha( alphaNum ){
        this.shaderMaterial.uniforms[ 'mixAlpha' ].value = alphaNum || 0;
    }
    
    drawOnCanvas( img, canvas  ) {
        return new Promise( ( resolve, reject) => {
            if ( img.width > 0 && img.height > 0 ) {
                canvas.width = this.config.geometry[ 0 ] * 20;
                canvas.height = this.config.geometry[ 1 ] * 20;
                let ctx = canvas.getContext( '2d' );
                ctx.drawImage( img, 0, 0, canvas.width, canvas.height  );
                resolve( canvas );
            } else {
                reject( {
                    error: 'unavailable img size 0x0 pxl.'
                } );
            }

        } );
    }

    setTexture1( img ){
        return new Promise( ( resolve, reject ) => {
             this.drawOnCanvas( img, this.canvas1 ).then( () => {
                 this.image1 = img
                 this.texture1.image = this.canvas1 ;
                 this.texture1.needsUpdate = true;
                 this.shaderForMaterial.uniforms.image1.value = this.texture1;
                 resolve( this.texture1 );
             }, () => {});
        } )
    }

    setTexture2( img ){
        return new Promise( ( resolve, reject ) => {
             this.drawOnCanvas( img, this.canvas2 ).then( () => {
                this.image2 = img
                this.texture2.image = this.canvas2 ;
                this.texture2.needsUpdate = true;
                this.shaderForMaterial.uniforms.image2.value = this.texture2;
                resolve( this.texture2 );
             }, () => {});
        } )
    }

    setDistortionMap( img ){
        return new Promise( ( resolve, reject ) => {
             this.drawOnCanvas( img, this.canvasDistortion ).then( () => {
                this.distortionMap.image = this.canvasDistortion;
                this.distortionMap.needsUpdate = true;
                this.shaderForMaterial.uniforms.distortionMap.value = this.distortionMap;
                resolve( this.distortionMap );
             }, () => {});
        } )
    }

}