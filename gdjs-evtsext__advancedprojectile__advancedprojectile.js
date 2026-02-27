
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile || {};

/**
 * Behavior generated from Advanced projectile
 */
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile = class AdvancedProjectile extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.MaxLifetime = behaviorData.MaxLifetime !== undefined ? behaviorData.MaxLifetime : Number("0") || 0;
    this._behaviorData.MaxDistanceFromStartingPosition = behaviorData.MaxDistanceFromStartingPosition !== undefined ? behaviorData.MaxDistanceFromStartingPosition : Number("0") || 0;
    this._behaviorData.MaxSpeed = behaviorData.MaxSpeed !== undefined ? behaviorData.MaxSpeed : Number("0") || 0;
    this._behaviorData.MinSpeed = behaviorData.MinSpeed !== undefined ? behaviorData.MinSpeed : Number("0") || 0;
    this._behaviorData.Acceleration = behaviorData.Acceleration !== undefined ? behaviorData.Acceleration : Number("0") || 0;
    this._behaviorData.StartingSpeed = behaviorData.StartingSpeed !== undefined ? behaviorData.StartingSpeed : Number("0") || 0;
    this._behaviorData.DeleteWhenLifetimeExceeded = behaviorData.DeleteWhenLifetimeExceeded !== undefined ? behaviorData.DeleteWhenLifetimeExceeded : true;
    this._behaviorData.DeleteWhenDistanceExceeded = behaviorData.DeleteWhenDistanceExceeded !== undefined ? behaviorData.DeleteWhenDistanceExceeded : true;
  }

  // Hot-reload:
  applyBehaviorOverriding(behaviorOverriding) {
    
    if (behaviorOverriding.MaxLifetime !== undefined)
      this._behaviorData.MaxLifetime = behaviorOverriding.MaxLifetime;
    if (behaviorOverriding.MaxDistanceFromStartingPosition !== undefined)
      this._behaviorData.MaxDistanceFromStartingPosition = behaviorOverriding.MaxDistanceFromStartingPosition;
    if (behaviorOverriding.MaxSpeed !== undefined)
      this._behaviorData.MaxSpeed = behaviorOverriding.MaxSpeed;
    if (behaviorOverriding.MinSpeed !== undefined)
      this._behaviorData.MinSpeed = behaviorOverriding.MinSpeed;
    if (behaviorOverriding.Acceleration !== undefined)
      this._behaviorData.Acceleration = behaviorOverriding.Acceleration;
    if (behaviorOverriding.StartingSpeed !== undefined)
      this._behaviorData.StartingSpeed = behaviorOverriding.StartingSpeed;
    if (behaviorOverriding.DeleteWhenLifetimeExceeded !== undefined)
      this._behaviorData.DeleteWhenLifetimeExceeded = behaviorOverriding.DeleteWhenLifetimeExceeded;
    if (behaviorOverriding.DeleteWhenDistanceExceeded !== undefined)
      this._behaviorData.DeleteWhenDistanceExceeded = behaviorOverriding.DeleteWhenDistanceExceeded;

    return true;
  }

  // Network sync:
  getNetworkSyncData(syncOptions) {
    return {
      ...super.getNetworkSyncData(syncOptions),
      props: {
        
    MaxLifetime: this._behaviorData.MaxLifetime,
    MaxDistanceFromStartingPosition: this._behaviorData.MaxDistanceFromStartingPosition,
    MaxSpeed: this._behaviorData.MaxSpeed,
    MinSpeed: this._behaviorData.MinSpeed,
    Acceleration: this._behaviorData.Acceleration,
    StartingSpeed: this._behaviorData.StartingSpeed,
    DeleteWhenLifetimeExceeded: this._behaviorData.DeleteWhenLifetimeExceeded,
    DeleteWhenDistanceExceeded: this._behaviorData.DeleteWhenDistanceExceeded,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData, options) {
    super.updateFromNetworkSyncData(networkSyncData, options);
    
    if (networkSyncData.props.MaxLifetime !== undefined)
      this._behaviorData.MaxLifetime = networkSyncData.props.MaxLifetime;
    if (networkSyncData.props.MaxDistanceFromStartingPosition !== undefined)
      this._behaviorData.MaxDistanceFromStartingPosition = networkSyncData.props.MaxDistanceFromStartingPosition;
    if (networkSyncData.props.MaxSpeed !== undefined)
      this._behaviorData.MaxSpeed = networkSyncData.props.MaxSpeed;
    if (networkSyncData.props.MinSpeed !== undefined)
      this._behaviorData.MinSpeed = networkSyncData.props.MinSpeed;
    if (networkSyncData.props.Acceleration !== undefined)
      this._behaviorData.Acceleration = networkSyncData.props.Acceleration;
    if (networkSyncData.props.StartingSpeed !== undefined)
      this._behaviorData.StartingSpeed = networkSyncData.props.StartingSpeed;
    if (networkSyncData.props.DeleteWhenLifetimeExceeded !== undefined)
      this._behaviorData.DeleteWhenLifetimeExceeded = networkSyncData.props.DeleteWhenLifetimeExceeded;
    if (networkSyncData.props.DeleteWhenDistanceExceeded !== undefined)
      this._behaviorData.DeleteWhenDistanceExceeded = networkSyncData.props.DeleteWhenDistanceExceeded;
  }

  // Properties:
  
  _getMaxLifetime() {
    return this._behaviorData.MaxLifetime !== undefined ? this._behaviorData.MaxLifetime : Number("0") || 0;
  }
  _setMaxLifetime(newValue) {
    this._behaviorData.MaxLifetime = newValue;
  }
  _getMaxDistanceFromStartingPosition() {
    return this._behaviorData.MaxDistanceFromStartingPosition !== undefined ? this._behaviorData.MaxDistanceFromStartingPosition : Number("0") || 0;
  }
  _setMaxDistanceFromStartingPosition(newValue) {
    this._behaviorData.MaxDistanceFromStartingPosition = newValue;
  }
  _getMaxSpeed() {
    return this._behaviorData.MaxSpeed !== undefined ? this._behaviorData.MaxSpeed : Number("0") || 0;
  }
  _setMaxSpeed(newValue) {
    this._behaviorData.MaxSpeed = newValue;
  }
  _getMinSpeed() {
    return this._behaviorData.MinSpeed !== undefined ? this._behaviorData.MinSpeed : Number("0") || 0;
  }
  _setMinSpeed(newValue) {
    this._behaviorData.MinSpeed = newValue;
  }
  _getAcceleration() {
    return this._behaviorData.Acceleration !== undefined ? this._behaviorData.Acceleration : Number("0") || 0;
  }
  _setAcceleration(newValue) {
    this._behaviorData.Acceleration = newValue;
  }
  _getStartingSpeed() {
    return this._behaviorData.StartingSpeed !== undefined ? this._behaviorData.StartingSpeed : Number("0") || 0;
  }
  _setStartingSpeed(newValue) {
    this._behaviorData.StartingSpeed = newValue;
  }
  _getDeleteWhenLifetimeExceeded() {
    return this._behaviorData.DeleteWhenLifetimeExceeded !== undefined ? this._behaviorData.DeleteWhenLifetimeExceeded : true;
  }
  _setDeleteWhenLifetimeExceeded(newValue) {
    this._behaviorData.DeleteWhenLifetimeExceeded = newValue;
  }
  _toggleDeleteWhenLifetimeExceeded() {
    this._setDeleteWhenLifetimeExceeded(!this._getDeleteWhenLifetimeExceeded());
  }
  _getDeleteWhenDistanceExceeded() {
    return this._behaviorData.DeleteWhenDistanceExceeded !== undefined ? this._behaviorData.DeleteWhenDistanceExceeded : true;
  }
  _setDeleteWhenDistanceExceeded(newValue) {
    this._behaviorData.DeleteWhenDistanceExceeded = newValue;
  }
  _toggleDeleteWhenDistanceExceeded() {
    this._setDeleteWhenDistanceExceeded(!this._getDeleteWhenDistanceExceeded());
  }
}

/**
 * Shared data generated from Advanced projectile
 */
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.SharedData = class AdvancedProjectileSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._AdvancedProjectile_AdvancedProjectileSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._AdvancedProjectile_AdvancedProjectileSharedData = new gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.SharedData(
      initialData
    );
  }
  return instanceContainer._AdvancedProjectile_AdvancedProjectileSharedData;
}

// Methods:
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects4= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1, gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3);

{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getVariables().get("__AdvancedProjectile").getChild("InitialForceLength")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getAverageForce().getLength()));
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getVariables().get("__AdvancedProjectile").getChild("InitialForceAngle")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getAverageForce().getAngle()));
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].clearForces();
}
}
}

}


{

gdjs.copyArray(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1, gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getVariables().get("__AdvancedProjectile").getChild("InitialForceLength")) == 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].addPolarForce((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3[i].getAngle()), eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStartingSpeed(), 1);
}
}
}

}


{

gdjs.copyArray(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1, gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("InitialForceLength")) > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].addPolarForce((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("InitialForceAngle"))), eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStartingSpeed(), 1);
}
}
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1, gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);

{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetStartingPositionToCurrentPosition(eventsFunctionContext);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStartingSpeed() != 0);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].resetTimer("__AdvancedProjectile.Lifetime");
}
}
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariableBoolean(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("IsInitialized"), false) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].setVariableBoolean(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("IsInitialized"), true);
}
}

{ //Subevents
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).DeleteWhenLifetimeExceeded(eventsFunctionContext) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsLifetimeExceeded(eventsFunctionContext) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].deleteFromScene(runtimeScene);
}
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).DeleteWhenDistanceExceeded(eventsFunctionContext) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsMaxDistanceExceeded(eventsFunctionContext) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].deleteFromScene(runtimeScene);
}
}
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForce")).setNumber((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForce"))));
}
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForce")) == 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].addPolarForce((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getAngle()), gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene) * eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAcceleration(), 1);
}
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForce")) > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].addPolarForce((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getAverageForce().getAngle()), gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene) * eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAcceleration(), 1);
}
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (Math.abs((( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[0].getAverageForce().getAngle()) - (( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[0].getAngle())) > 90);
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].clearForces();
}
}
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAcceleration() != 0);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMinSpeed() != 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getAverageForce().getLength() < eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMinSpeed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForceAngle")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getAverageForce().getAngle()));
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].clearForces();
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].addPolarForce((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2[i].getAngle()), eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMinSpeed(), 1);
}
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxSpeed() != 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getAverageForce().getLength() > eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxSpeed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForceAngle")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getAverageForce().getAngle()));
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].clearForces();
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].addPolarForce((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("CurrentForceAngle"))), eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxSpeed(), 1);
}
}
}

}


};gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList2(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList3(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList5(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList6(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects4.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.eventsList7(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPostEventsContext.GDObjectObjects4.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[i].getVariableBoolean(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("IsInitialized"), true) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxDistanceFromStartingPosition() > 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.common.distanceBetweenPositions((gdjs.RuntimeObject.getVariableNumber(((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length === 0 ) ? gdjs.VariablesContainer.badVariablesContainer : gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[0].getVariables()).get("__AdvancedProjectile").getChild("StartingX"))), (gdjs.RuntimeObject.getVariableNumber(((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length === 0 ) ? gdjs.VariablesContainer.badVariablesContainer : gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[0].getVariables()).get("__AdvancedProjectile").getChild("StartingY"))), (( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[0].getX()), (( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1[0].getY())) > eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxDistanceFromStartingPosition());
}
}
}
if (isConditionTrue_0) {
{eventsFunctionContext.returnValue = true;}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceeded = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsMaxDistanceExceededContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[i].getVariableBoolean(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("IsInitialized"), true) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxLifetime() > 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[i].getTimerElapsedTimeInSecondsOrNaN("__AdvancedProjectile.Lifetime") > eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxLifetime() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[k] = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length = k;
}
}
if (isConditionTrue_0) {
{eventsFunctionContext.returnValue = true;}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceeded = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.IsLifetimeExceededContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxLifetime();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetime = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxLifetimeContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxLifetime(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetime = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxLifetimeContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1[i].resetTimer("__AdvancedProjectile.Lifetime");
}
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimer = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.RestartLifetimeTimerContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxDistanceFromStartingPosition();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStart = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxDistanceFromStartContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxDistanceFromStartingPosition(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStart = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxDistanceFromStartContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("StartingX")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].getX()));
}
}
{for(var i = 0, len = gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].getVariables().get("__AdvancedProjectile").getChild("StartingY")).setNumber((gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1[i].getY()));
}
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPosition = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingPositionToCurrentPositionContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxSpeed();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeed = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MaxSpeedContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxSpeed(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeed = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMaxSpeedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMinSpeed();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeed = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.MinSpeedContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMinSpeed(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeed = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetMinSpeedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAcceleration();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.Acceleration = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.AccelerationContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setAcceleration(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAcceleration = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetAccelerationContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStartingSpeed();}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeed = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.StartingSpeedContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStartingSpeed(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeed = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetStartingSpeedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDeleteWhenLifetimeExceeded();
}
if (isConditionTrue_0) {
{eventsFunctionContext.returnValue = true;}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceeded = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenLifetimeExceededContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !eventsFunctionContext.getArgument("Value");
}
if (isConditionTrue_0) {
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDeleteWhenLifetimeExceeded(false)
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("Value");
}
if (isConditionTrue_0) {
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDeleteWhenLifetimeExceeded(true)
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceeded = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenLifetimeExceededContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDeleteWhenDistanceExceeded();
}
if (isConditionTrue_0) {
{eventsFunctionContext.returnValue = true;}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceeded = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.DeleteWhenDistanceExceededContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext = {};
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.idToCallbackMap = new Map();
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects1= [];
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects2= [];


gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !eventsFunctionContext.getArgument("Value");
}
if (isConditionTrue_0) {
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDeleteWhenDistanceExceeded(false)
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("Value");
}
if (isConditionTrue_0) {
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDeleteWhenDistanceExceeded(true)
}
}

}


};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceeded = function(Value, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
let scopeInstanceContainer = null;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AdvancedProjectile"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AdvancedProjectile"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.SetDeleteWhenDistanceExceededContext.GDObjectObjects2.length = 0;


return;
}

gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("AdvancedProjectile::AdvancedProjectile", gdjs.evtsExt__AdvancedProjectile__AdvancedProjectile.AdvancedProjectile);
