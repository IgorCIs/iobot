import * as THREE from 'three';

export function MorphCloud( config ){

    const pathCount = config.pathCount;

    const ShaderParams = {

        uniforms: {
            'eye': { value: new THREE.Vector3() },
            'raycastPoint': { value: new THREE.Vector3() },
            'raycastedPoints': { value: [ new THREE.Vector3() ] },
            'sunDirection': { value: new THREE.Vector3() },
            'maxDistance': { value: 5.0 },
            'pointSize': { value: 3.0 },
            'timeScaleFactor': { value:  0.003 },
            'uvScaleFactor': { value:  0.003 },
            'sizeFactor': { value:  8.2 },
            'alpha': { value: 0.0 },
            'lines': { value: 20.0 },
            'time': { value: 0.0 },
            'size': { value: 122.3 },
            'textureMatrix': { value: new THREE.Matrix4() },
        },

        vertexShader:
            `
            uniform float sizeFactor;
            uniform float uvScaleFactor;
            uniform float timeScaleFactor;
            uniform float pointSize;
            
            uniform mat4 textureMatrix;
            uniform float maxDistance;
            uniform float time;
            uniform float alpha;
            uniform vec3 eye;
            
            varying vec4 worldPosition;
            
            varying vec2 vUv;
            varying vec4 vColor;
            varying float distanceToMouseAlpha;
            varying float distanceToRaycastPoint;
            
            float PI = 3.141592653589793;
            
            uniform vec3 raycastPoint;
            uniform vec3 raycastedPoints[ ${ pathCount } ];
            const float pathCount = ${ pathCount }.0; 
            const int pathCountInt = ${ pathCount }; 
            
            float distanceBetweenVec3( vec3 v1, vec3 v2 ){
                float dx = v1.x - v2.x;
                float dy = v1.y - v2.y;
                float dz = v1.z - v2.z;
                float result = sqrt( dx * dx + dy * dy + dz * dz );
                return result;
            }
            
            vec3 convertToNormal( vec3 src ){
                return vec3( ( 0.5 - src.x ) * 2.0, ( 0.5 - src.y ) * 2.0, ( 0.5 - src.z ) * 2.0 );
            }
            
            float getMod( float a, float b ) {
                float result =  a - ( b * floor( a / b ) );
                return result;
            }
            
            vec4 getMixedColor( sampler2D tex1, sampler2D tex2, vec2 _uv ){
                    vec4 mixedColor = ( texture2D( tex1, _uv ) + texture2D( tex2, _uv ) ) * 0.5;
                    return mixedColor;
            }
            
            
            vec3 lt_ln_to_xyz( float lt, float ln, float radius ){
                vec3 resultXYZ = vec3(
                    radius * cos(lt) * cos(ln),
                    radius * cos(lt) * sin(ln),
                    radius * sin(lt)
                );
                return resultXYZ;
            }
            
            vec2 xyz_to_lt_ln( vec3 pos ){
                return vec2( 
                    acos( pos.y / sqrt( pos.x * pos.x + pos.z * pos.z) ), 
                    atan( pos.x / pos.z ) 
                );
            }
            
            vec3 slerp(vec3 start, vec3 end, float t) {  
                    // Dot product - the cosine of the angle between 2 vectors.  
                    float dot = dot(start, end);
                    // Clamp it to be in the range of Acos() 
                    // This may be unnecessary, but floating point  
                    // precision can be a fickle mistress.    
                    dot = clamp(dot, -1.0, 1.0);  
                    // Acos(dot) returns the angle between start and end,   
                    // And multiplying that by time returns the angle between   
                    // start and the final result.   
                    float theta = acos(dot) * t;
                    vec3 RelativeVec = normalize(end - start * dot); 
                    return ((start * cos(theta)) + (RelativeVec * sin(theta)));
            }
            
            vec3 aproximatedRaycastedPoint(){
            
                vec3 finalPoint = vec3( 0.0 );
                
                float floatIterator = 0.0;
                float totalMultiplyFactor = 0.0;
                
                for( int i = 0; i < pathCountInt; i++ ){
                    float nextMultiplyFactor = ( floatIterator / pathCount );
                    totalMultiplyFactor += nextMultiplyFactor;
                    finalPoint += raycastedPoints[ i ] * nextMultiplyFactor;
                    floatIterator += 1.0;
                }
                finalPoint = finalPoint / totalMultiplyFactor;
                return finalPoint;
            }
            
            vec4 getNearestRaycastedPoint( vec3 position ){
                vec4 finalPoint = vec4( 0.0 );
                float lastDistance = 99999999999.0;
                for( int i = 0; i < pathCountInt; i++ ){
                    float nextDistance = distanceBetweenVec3( position.xyz , raycastedPoints[ i ] );
                    if( nextDistance < lastDistance ){
                        lastDistance = nextDistance;
                        finalPoint =  vec4( raycastedPoints[ i ], abs( sin( float( i ) / pathCount * -PI / 2.0 ) ) );
                    }
                }
                return finalPoint;
            }
            
            void main() {
            
            	vUv = uv;
            	
                vec3 normaledEye = normalize( eye );
            	
            	vec4 pixelPosition = modelMatrix * vec4( position, 1.0 );
            	vec4 mvStartPosition = pixelPosition;
            	worldPosition = pixelPosition;
            	
            	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            	vec4 nearestRaycasted = getNearestRaycastedPoint( pixelPosition.xyz );
            	// vec3 _raycastPoint = raycastPoint;
            	// vec3 _raycastPoint = aproximatedRaycastedPoint();
            	vec3 _raycastPoint = nearestRaycasted.xyz;
            	
            	distanceToRaycastPoint = distanceBetweenVec3( pixelPosition.xyz , _raycastPoint );
            
                float distanceFactor;
                vec4 finalGlPosition;
            
                float distanceAlpha = 1.0 - distanceToRaycastPoint / maxDistance;
                distanceFactor = distanceAlpha;
                distanceToMouseAlpha = distanceAlpha;
                float timeScaleFactorAfter = timeScaleFactor * 0.7;
                float pixelPScaleFactor = 0.2;
                
                float multiplyFactorForRaycastedPath = 1.0;
                if( distanceFactor < 0.12 ){
                    distanceFactor = 0.12;
                    timeScaleFactorAfter = timeScaleFactor;
                    pixelPScaleFactor = 0.2;
                } else {
                    multiplyFactorForRaycastedPath = nearestRaycasted.w * alpha;
                    // distanceFactor = 0.55 * sin( distanceAlpha * PI/ 2.0 );
                    timeScaleFactorAfter = timeScaleFactor * 2.0;
                    pixelPScaleFactor = 1.7;
                }
                
                vec2 currentLtLn = xyz_to_lt_ln(  vec3( 1.0, 1.0, 0.0 ) );
                
                currentLtLn.x = getMod( 
                    currentLtLn.x + 
                    ( mvPosition.x + mvPosition.z ) * pixelPScaleFactor + 
                    ( time * timeScaleFactorAfter * 0.5  ) * 
                    PI * 2.0, 
                    PI * 2.0 
                ) ;  
                
                currentLtLn.y = -PI/ 2.0 + sin( getMod( 
                    currentLtLn.y + 
                    ( mvPosition.z - mvPosition.y ) * pixelPScaleFactor + 
                    ( time * timeScaleFactorAfter ) * 
                    PI, 
                    PI 
                ) ) * PI; 
                
                vec3 positionOfLtLn_default = lt_ln_to_xyz( 
                    currentLtLn.x, 
                    currentLtLn.y, 
                    distanceFactor * 3.5 * multiplyFactorForRaycastedPath
                );
                
                vec3 positionOfLtLn_for_pointer = lt_ln_to_xyz( 
                    currentLtLn.x, currentLtLn.y, 
                    distanceFactor * 5.5 * abs( sin( time * timeScaleFactor ) )
                );
                
                vec3 positionOfLtLn;
                
                if( distanceFactor > 0.05 ){
                    float clipFactor = 0.2;
                    float test1 = distanceFactor - clipFactor;
                    float test2 = 0.0;
                    if( test1 > 0.0 ){
                        test2 = sin( ( test1 ) * 2.0 * PI / 2.0 );
                    }
                    positionOfLtLn = slerp( positionOfLtLn_default, positionOfLtLn_for_pointer, test2 );
                } else {
                    positionOfLtLn = positionOfLtLn_default;
                }
                
                pixelPosition.xyz += positionOfLtLn;
                vec4 preGlPosition =  projectionMatrix * modelViewMatrix * pixelPosition;
                finalGlPosition = preGlPosition;
                    
                gl_Position =  finalGlPosition;
                vColor = normalize( finalGlPosition );
                
                if ( gl_Position.w > 0.0 ) {
                    gl_PointSize = 12.0 * pointSize / gl_Position.w + ( pointSize * distanceFactor * 0.5 );
                } else {
                    gl_PointSize = 3.0;
                }
                
            	
            	
            }
        `,

        fragmentShader: `
            uniform float alpha;
            uniform float lines;
            uniform float time;
            uniform float size;
            uniform vec3 eye;
            uniform vec3 sunDirection;
            uniform float timeScaleFactor;

            varying vec4 worldPosition;
            varying vec2 vUv;
            varying vec4 vColor;
            varying float distanceToMouseAlpha;
            varying float distanceToRaycastPoint;
            
           
            const float gridSize = 3.0;
            const float pixelsPerUnit = 32.0;
            const vec2 resolution = vec2( 1024.0, 1024.0 );
            
            const vec3 tinLineColor = vec3( 1.0, 1.0, 1.0 );
            const vec3 wideLineColor = vec3( 1.0, 1.0, 0.6 );
            
            const float tinLineWidth = 32.0;
            const float wideLineWidth = 12.0;
            
            const float tinLineOpacity = 1.0;
            const float wideLineOpacity = 1.0;
            
            float PI = 3.141592653589793;
     
            float getTimeLineWidthScale(){
                // return ( tinLineWidth / 2.0 ) + abs( sin( time * 0.13 ) * tinLineWidth );
                return tinLineWidth;
            }
     
            float getMod( float a, float b ) {
                float result =  a - ( b * floor( a / b ) );
                return result;
            }
            
            bool checkIsLine(){
            
                // resolution in pixels
                vec2 resInPix = vec2( resolution.x * pixelsPerUnit, resolution.y * pixelsPerUnit );
                
                // line alpha size
                vec2 lineAlphaSize = vec2( getTimeLineWidthScale() / resInPix.x, getTimeLineWidthScale() / resInPix.y );
                vec2 gridAlphaSize = vec2( 1.0 / ( resolution.x / gridSize ), 1.0 / ( resolution.y / gridSize ) );
            
                vec2 gridAlphaModLeft = vec2(
                    getMod( vUv.x + ( lineAlphaSize.x * .5 ), gridAlphaSize.x ),
                    getMod( vUv.y + ( lineAlphaSize.y * .5 ), gridAlphaSize.y )
                );
            
                bool lineAvailableX = gridAlphaModLeft.x < lineAlphaSize.x;
                // bool lineAvailableX = false;
                bool lineAvailableY = false;
                // bool lineAvailableY = gridAlphaModLeft.y < lineAlphaSize.y;
            
                return lineAvailableX || lineAvailableY || false;
            }
            
            bool checkIsLine2(){
            
                // resolution in pixels
                vec2 resInPix = vec2( resolution.x * pixelsPerUnit, resolution.y * pixelsPerUnit );
                
                // line alpha size
                vec2 lineAlphaSize = vec2( getTimeLineWidthScale() / resInPix.x, getTimeLineWidthScale() / resInPix.y );
                vec2 gridAlphaSize = vec2( 1.0 / ( resolution.x / gridSize ), 1.0 / ( resolution.y / gridSize ) );
            
                vec2 gridAlphaModLeft = vec2(
                    getMod( vUv.x + ( lineAlphaSize.x * .5 ), gridAlphaSize.x ),
                    getMod( vUv.y + ( lineAlphaSize.y * .5 ), gridAlphaSize.y )
                );
            
                bool lineAvailableX = gridAlphaModLeft.x < lineAlphaSize.x;
                bool lineAvailableY = gridAlphaModLeft.y < lineAlphaSize.y;
            
                return lineAvailableX || lineAvailableY || false;
            }
            
            bool checkIsPoint(){
            
                // resolution in pixels
                vec2 resInPix = vec2( resolution.x * pixelsPerUnit, resolution.y * pixelsPerUnit );
                
                // line alpha size
                vec2 lineAlphaSize = vec2( getTimeLineWidthScale() / resInPix.x, getTimeLineWidthScale() / resInPix.y );
                vec2 gridAlphaSize = vec2( 1.0 / ( resolution.x / gridSize ), 1.0 / ( resolution.y / gridSize ) );
            
                vec2 gridAlphaModLeft = vec2(
                    getMod( vUv.x + ( lineAlphaSize.x * .5 ), gridAlphaSize.x ),
                    getMod( vUv.y + ( lineAlphaSize.y * .5 ), gridAlphaSize.y )
                );
            
                bool lineAvailableX = gridAlphaModLeft.x < lineAlphaSize.x;
                bool lineAvailableY = gridAlphaModLeft.y < lineAlphaSize.y;
            
                return  ( lineAvailableX && lineAvailableY ) || false;
            }
            
            float checkLineOpacityByX(){
            
                // resolution in pixels
                vec2 resInPix = vec2( resolution.x * pixelsPerUnit, resolution.y * pixelsPerUnit );
                
                // line alpha size
                vec2 lineAlphaSize = vec2( getTimeLineWidthScale() / resInPix.x, getTimeLineWidthScale() / resInPix.y );
                vec2 gridAlphaSize = vec2( 1.0 / ( resolution.x / gridSize ), 1.0 / ( resolution.y / gridSize ) );
            
                vec2 gridAlphaModLeft = vec2(
                    getMod( vUv.x + ( lineAlphaSize.x * .5 ), gridAlphaSize.x ),
                    getMod( vUv.y + ( lineAlphaSize.y * .5 ), gridAlphaSize.y )
                );
                
                float nextOpacity = sin( gridAlphaModLeft.x / lineAlphaSize.x * 3.14 );
                return nextOpacity;
            }
            
            bool checkIsCenter(){
            
                bool isCenterX = abs(
                   ( vUv.x * resolution.x * pixelsPerUnit ) - ( 0.5 * resolution.x * pixelsPerUnit )
                ) < ( wideLineWidth * .5 );
            
                bool isCenterY = abs(
                    ( vUv.y * resolution.y * pixelsPerUnit ) - ( 0.5 * resolution.y * pixelsPerUnit )
                ) < ( wideLineWidth * .5 );
            
                if( isCenterX ){
                    return true;
                } else if( isCenterY ) {
                    return true;
                } else {
                    return false;
                }
            }
     
            vec4 getMixedColor( sampler2D tex1, sampler2D tex2, vec2 _uv ){
                    vec4 mixedColor = ( texture2D( tex1, _uv ) + texture2D( tex2, _uv ) ) * 0.5;
                    return mixedColor;
            }
            
            void main() {
            
                vec2 pc = ( gl_PointCoord - 0.5 ) * 2.0;
                
                if( distanceToMouseAlpha < 0.0 ){
                    vec4 finalColor = vColor;
                    // vec4 color2 = vec4( abs( sin( PI + time * timeScaleFactor +  time * distanceToRaycastPoint * 0.01 ) ), abs( sin( time * timeScaleFactor +  time * distanceToRaycastPoint * 0.01 ) ), abs( sin( time * timeScaleFactor -  time * distanceToRaycastPoint * 0.01 ) ), 1.0 );
                    gl_FragColor = finalColor;
                } else {
                    vec4 color1 = vColor;
                    vec4 color2 = vec4( 1.0, 0.5 * abs( sin( time * timeScaleFactor ) ), 0.0, 1.0 );
                    vec4 finalColor = ( color2 * distanceToMouseAlpha ) + ( color1 * ( 1.0 - distanceToMouseAlpha ) );
                    gl_FragColor = finalColor;
                }

                // gl_FragColor = vec4( 1.0 ); 
            }
        `

    };

    return ShaderParams;

}

export default class MorphCloudShader {

    constructor( config ){
        this.config = config;

        this.onBeforeRenderConfig = {};

        this.shaderForMaterial = null;
        this.shaderMaterial = null;
        this.shaderGeometry = null;
        this.shaderMesh = null;
        this.camera = null;
        this.raycaster = new THREE.Raycaster();
        this.mouseXY = new THREE.Vector2();
        this.animationFuntction = () => {};

        this.init();
    }

    init(){

        this.shaderForMaterial = MorphCloud( {
            pathCount: this.config.pathCount
        } );

        this.shaderForMaterial.uniforms.lines.value = 3;
        this.shaderForMaterial.uniforms.time.value = 0;
        this.shaderForMaterial.uniforms.timeScaleFactor.value = 0.003;

        let raycastedPoints = [];
        for( let i = 0; i < this.config.pathCount; i++  ){ raycastedPoints.push( new THREE.Vector3() ); }
        this.shaderForMaterial.uniforms.raycastedPoints.value = raycastedPoints;

        this.shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: this.shaderForMaterial.uniforms,
            vertexShader: this.shaderForMaterial.vertexShader,
            fragmentShader: this.shaderForMaterial.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        } );



        this.shaderGeometry = new THREE.BufferGeometry();
        
        const verticesForBuffer = [];
        for ( const nextVert of this.config.vertices ) {
            verticesForBuffer.push( nextVert.x );
            verticesForBuffer.push( nextVert.y );
            verticesForBuffer.push( nextVert.z );
        }
        const resultVertices = new Float32Array( verticesForBuffer );
        this.shaderGeometry.addAttribute( 'position', new THREE.BufferAttribute( resultVertices, 3 ) );

        this.shaderMesh = new THREE.Points( this.shaderGeometry,  this.shaderMaterial );

        this.initAnimationProperties();

        this.shaderMesh.onBeforeRender = ( renderer, scene, camera, geometry, material, group ) => {
            if( this.config.onBeforeRender ){
                this.config.onBeforeRender( renderer, scene, camera, geometry, material, group );
            }
            this.onBeforeRenderConfig = { renderer, scene, camera, geometry, material, group };

        }

    }

    animate(){
        if( this.onBeforeRenderConfig.camera ){

            this.camera = this.onBeforeRenderConfig.camera;
            this.animationFuntction();
            this.shaderMaterial.uniforms[ 'eye' ].value = this.camera.position.clone();
            this.shaderMaterial.uniforms[ 'time' ].value += 1;
            this.shaderMaterial.needsUpdate = true;
        }
    }

    initAnimationProperties(){

        const lastPoint = new THREE.Vector3();
        const currentRaycastedPoint = new THREE.Vector3();
        const pointForDisable = new THREE.Vector3( 0, 0, 0 );
        const vec0 = new THREE.Vector3( 0, 0, 0 );

        let framesToMorph = 120;
        let currentFrame = framesToMorph;


        let raycastedPoints = [];
        for( let i = 0; i < this.config.pathCount; i++  ){ raycastedPoints.push( new THREE.Vector3() ); }
        this.shaderMaterial.uniforms[ 'raycastedPoints' ].value = raycastedPoints;

        this.animationFuntction = () => {

            let raycastedPoint = this.raycastModel();

            if ( raycastedPoint.length > 0 ) {

                // console.log( 'i am there', raycastedPoint);

                if( this.shaderForMaterial.uniforms.alpha.value < 1 ){
                    this.shaderForMaterial.uniforms.alpha.value += 1 / framesToMorph / 115;
                } else if ( this.shaderForMaterial.uniforms.alpha.value > 1 ){
                    this.shaderForMaterial.uniforms.alpha.value = 1;
                }

                currentFrame = framesToMorph;

                currentRaycastedPoint.copy( raycastedPoint[ 0 ].point );

                lastPoint.copy( currentRaycastedPoint );

                this.shaderMaterial.uniforms[ 'raycastPoint' ].value = currentRaycastedPoint;

                raycastedPoints.push( lastPoint.clone() );
                if( raycastedPoints.length > this.config.pathCount ) { raycastedPoints.shift(); }
                this.shaderMaterial.uniforms[ 'raycastedPoints' ].value = raycastedPoints;

            } else {

                // console.log( 'testtesttest' );

                if( this.shaderForMaterial.uniforms.alpha.value > 0 ){
                    this.shaderForMaterial.uniforms.alpha.value -= 1 / framesToMorph * 3;
                } else if ( this.shaderForMaterial.uniforms.alpha.value < 0 ){
                    this.shaderForMaterial.uniforms.alpha.value = 0;
                }

                if ( !lastPoint.equals( vec0 ) ) {
                    pointForDisable.copy( lastPoint );
                    pointForDisable.multiplyScalar( 4 );
                    if ( currentFrame > 0 ) {
                        let nextPoint = pointForDisable.lerp( lastPoint, Math.sin( currentFrame / framesToMorph * Math.PI / 2 ) );
                        this.shaderMaterial.uniforms[ 'raycastPoint' ].value = nextPoint;
                        raycastedPoints.push( nextPoint );
                        if( raycastedPoints.length > this.config.pathCount ) { raycastedPoints.shift(); }
                        this.shaderMaterial.uniforms[ 'raycastedPoints' ].value = raycastedPoints;

                        currentFrame--;
                    } else {
                        raycastedPoints.push( pointForDisable );
                        if( raycastedPoints.length > this.config.pathCount ) { raycastedPoints.shift(); }
                        this.shaderMaterial.uniforms[ 'raycastedPoints' ].value = raycastedPoints;
                        this.shaderMaterial.uniforms[ 'raycastPoint' ].value = pointForDisable;
                    }
                }
            }


        };

    }

    raycastModel(){
        this.raycaster.setFromCamera( this.mouseXY, this.camera );
        return this.raycaster.intersectObject( this.shaderMesh );
    }


    updateMouseNormal( nextMouseNormal ){
        this.mouseXY.copy( nextMouseNormal );
    }

}

