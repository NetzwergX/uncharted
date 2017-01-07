//  TODO this is 99.9% unscientific.  I'm using this SO answer http://astronomy.stackexchange.com/questions/13382/planets-classification-by-density?rq=1
//  to say rocky < .1 jupiter masses.  also the shaders are super crude placeholders.
function getShader(planetData) {
  console.log(planetData);

  if (planetData.massKg.value.quantity < 1.898e26) { //  10% jupiter
    return shaders.rockyPlanetFragmentShader;
  } else {
    return shaders.gasPlanetFragmentShader;
  }
}


var NAME_TO_MAP = {
  Earth: "images/planets/earthmap1k.jpg",
  Mercury: "images/planets/mercurymap.jpg",
  Venus: "images/planets/venusmap.jpg",
  Mars: "images/planets/marsmap1k.jpg",
  Jupiter: "images/planets/jupiter2_4k.jpg",
  Saturn: "images/planets/saturnmap.jpg",
  Uranus: "images/planets/uranusmap.jpg",
  Neptune: "images/planets/neptunemap.jpg"
}

function getPlanet(planetData) {

  var planetMap = NAME_TO_MAP[planetData.properName];

  if (planetMap) {

    return {
      material:new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture(planetMap)
      }),
      //  TODO actual planet axis rotation
      rotation: {
        x: 0,
        y: Math.PI / 2,
        z: - Math.PI / 2
    }};

  } else {
    return {
      material: new THREE.ShaderMaterial({
        uniforms: {
          time: uniforms.time,
          scale: uniforms.scale
        },
        vertexShader: shaders.staticVertexShader,
        fragmentShader: getShader(planetData),
        transparent: false
      }),
      rotation: {
        // z: Math.PI / 2,
        y: Math.PI / 2,
      }
    };

  }

}

function getDetailMesh(planetData) {

  var planet = getPlanet(planetData);
  var planetMesh = new THREE.Mesh(DETAIL_GEOMETRY, planet.material);
  planetMesh.scale.x = planetMesh.scale.y = planetMesh.scale.z = planetData.radius.value.quantity;

  planetMesh.rotateX(planet.rotation.x);
  planetMesh.rotateY(planet.rotation.y);
  planetMesh.rotateZ(planet.rotation.z);

  return planetMesh;
}