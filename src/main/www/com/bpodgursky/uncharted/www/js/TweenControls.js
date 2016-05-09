THREE.TweenControls = function (camera, scene) {

  this.camera = camera;
  this.scene = scene;

  this.targetRotation = null;
  this.startRotation = null;
  this.midRotation = null;

  this.targetPosition = null;
  this.startPosition = null;
  this.midPosition = null;

  this.tMax = null;
  this.tCurrent = null;

  this.onComplete = null;

  this.getTarget = function (start, target) {

    var raw = target - start;
    if (raw > Math.PI) {
      return target - 2 * Math.PI
    }

    if (raw < -Math.PI) {
      return target + 2 * Math.PI;
    }

    return target;

  };

  this.lookAt = function (endRotation, endPosition, onComplete, time) {

    this.startRotation = {
      x: this.scene.rotation.x,
      y: this.scene.rotation.y,
      z: this.scene.rotation.z
    };

    this.targetRotation = {
      x: this.getTarget(this.startRotation.x, endRotation.x),
      y: this.getTarget(this.startRotation.y, endRotation.y),
      z: this.getTarget(this.startRotation.z, endRotation.z)
    };

    this.midRotation = {
      x: (this.scene.rotation.x + this.targetRotation.x) / 2,
      y: (this.scene.rotation.y + this.targetRotation.y) / 2,
      z: (this.scene.rotation.z + this.targetRotation.z) / 2
    };

    this.startPosition = {
      x: this.scene.position.x,
      y: this.scene.position.y,
      z: this.scene.position.z
    };

    this.targetPosition = {
      x: endPosition.x,
      y: endPosition.y,
      z: endPosition.z
    };

    this.midPosition = {
      x: (this.startPosition.x + this.targetPosition.x) / 2,
      y: (this.startPosition.y + this.targetPosition.y) / 2,
      z: (this.startPosition.z + this.targetPosition.z) / 2
    };

    this.tMax = time;
    this.tCurrent = 0;

    this.onComplete = onComplete;
  };

  this.updateVar = function (mid, target, start) {
    return mid + (target - start) / 2 * Math.sin(Math.PI * this.tCurrent / this.tMax - Math.PI / 2)
  };

  this.updateVec = function (mid, start, target, update) {
    update.x = this.updateVar(mid.x, target.x, start.x);
    update.y = this.updateVar(mid.y, target.y, start.y);
    update.z = this.updateVar(mid.z, target.z, start.z);
  };

  this.update = function (delta) {

    this.updateVec(this.midRotation, this.startRotation, this.targetRotation, this.scene.rotation);
    this.updateVec(this.midPosition, this.startPosition, this.targetPosition, this.scene.position);

    this.tCurrent += delta;

    if (this.tCurrent >= this.tMax) {
      this.onComplete();
    }

  }

};