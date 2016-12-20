var orbitMaterial = new THREE.LineBasicMaterial({
  color: 0x33cc33,
  depthWrite: false
});

var scaleMaterial = new THREE.LineBasicMaterial({
  color: 0xbb33ff,
  depthWrite: false
});

var transparentMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  color: 0x000000,
  depthWrite: false,
  renderOrder: 1,
  opacity: 0.0
});

var TRANSPARENT_GEOMETRY = new THREE.SphereGeometry(1.0, 16, 16);
var DETAIL_GEOMETRY = new THREE.SphereGeometry(1.0, 64, 64);

function System(star, position, planets) {

  this.object = new THREE.Group();
  this.star = star;
  var object = this.object;

  var starData = star.objectData;

  var material = new THREE.ShaderMaterial({
    uniforms: {
      time: uniforms.time,
      scale: uniforms.scale,
      highTemp: {type: "f", value: starData.temperatureEstimate.value.quantity},
      lowTemp: {type: "f", value: starData.temperatureEstimate.value.quantity / 4}
    },
    vertexShader: shaders.dynamicVertexShader,
    fragmentShader: shaders.starFragmentShader,
    transparent: false
  });

  var starDetail = new THREE.Mesh(DETAIL_GEOMETRY, material);
  starDetail.objectData = starData;
  starDetail.scale.x = starDetail.scale.y = starDetail.scale.z = starData.radius.value.quantity;

  object.add(starDetail);

  this.selectable = [starDetail];
  var planetSelectable = this.selectable;

  this.objectsByID = {};
  this.objectsByID[star.objectData.primaryId] = star;

  var planetsByID = this.objectsByID;

  this.object.position.x = position.x;
  this.object.position.y = position.y;
  this.object.position.z = position.z;

  var axes = [];

  planets.forEach(function (planet) {

    var major = planet.semiMajorAxisLys.value.quantity;
    var minor = planet.semiMinorAxisLys.value.quantity;

    var focusOffset = Math.sqrt(Math.pow(major/2, 2) - Math.pow(minor/2, 2));

    axes.push(major+focusOffset);

    var ellipse = new THREE.EllipseCurve(focusOffset, 0, major, minor, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    ellipseGeometry.computeTangents();
    var line = new THREE.Line(ellipseGeometry, orbitMaterial);
    object.add(line);

    var planetMesh = getDetailMesh(planet);

    var surround = new THREE.Mesh(TRANSPARENT_GEOMETRY, transparentMaterial);
    surround.scale.set(10, 10, 10);
    surround.objectData = planet;

    planetMesh.objectData = planet;
    planetMesh.add(surround);

    planetMesh.position.x = major+focusOffset;
    object.add(planetMesh);

    planetSelectable.push(surround);
    planetsByID[planet.primaryId] = planetMesh;

  });

  var maxDistance = Math.max.apply(null, axes);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(maxDistance, 0, 0));

  var lineMesh = new THREE.Line(geometry, scaleMaterial);

  object.add(lineMesh);

}

//  TODO this is 99.9% unscientific.  I'm using this SO answer http://astronomy.stackexchange.com/questions/13382/planets-classification-by-density?rq=1
//  to say rocky < .1 jupiter masses.  also the shaders are super crude placeholders.
function getShader(planetData){
  if(planetData.massKg.value.quantity < 1.898e26){ //  10% jupiter
    return shaders.rockyPlanetFragmentShader;
  }else{
    return shaders.gasPlanetFragmentShader;
  }
}

function getDetailMesh(planetData){

  var material = new THREE.ShaderMaterial({
    uniforms: {
      time: uniforms.time,
      scale: uniforms.scale
    },
    vertexShader: shaders.staticVertexShader,
    fragmentShader: getShader(planetData),
    transparent: false
  });

  var planetMesh = new THREE.Mesh(DETAIL_GEOMETRY, material);
  planetMesh.scale.x = planetMesh.scale.y = planetMesh.scale.z = planetData.radius.value.quantity;

  planetMesh.rotateY(Math.PI/2);

  return planetMesh;
}