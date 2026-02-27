
gdjs.evtsExt__FaceForward__FaceForward = gdjs.evtsExt__FaceForward__FaceForward || {};

/**
 * Behavior generated from Face forward
 */
gdjs.evtsExt__FaceForward__FaceForward.FaceForward = class FaceForward extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__FaceForward__FaceForward.FaceForward.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.RotationSpeed = behaviorData.RotationSpeed !== undefined ? behaviorData.RotationSpeed : Number("0") || 0;
    this._behaviorData.OffsetAngle = behaviorData.OffsetAngle !== undefined ? behaviorData.OffsetAngle : Number("0") || 0;
    this._behaviorData.PreviousX = Number("") || 0;
    this._behaviorData.PreviousY = Number("") || 0;
    this._behaviorData.MovementDirection = Number("0") || 0;
  }

  // Hot-reload:
  applyBehaviorOverriding(behaviorOverriding) {
    
    if (behaviorOverriding.RotationSpeed !== undefined)
      this._behaviorData.RotationSpeed = behaviorOverriding.RotationSpeed;
    if (behaviorOverriding.OffsetAngle !== undefined)
      this._behaviorData.OffsetAngle = behaviorOverriding.OffsetAngle;
    if (behaviorOverriding.PreviousX !== undefined)
      this._behaviorData.PreviousX = behaviorOverriding.PreviousX;
    if (behaviorOverriding.PreviousY !== undefined)
      this._behaviorData.PreviousY = behaviorOverriding.PreviousY;
    if (behaviorOverriding.MovementDirection !== undefined)
      this._behaviorData.MovementDirection = behaviorOverriding.MovementDirection;

    return true;
  }

  // Network sync:
  getNetworkSyncData(syncOptions) {
    return {
      ...super.getNetworkSyncData(syncOptions),
      props: {
        
    RotationSpeed: this._behaviorData.RotationSpeed,
    OffsetAngle: this._behaviorData.OffsetAngle,
    PreviousX: this._behaviorData.PreviousX,
    PreviousY: this._behaviorData.PreviousY,
    MovementDirection: this._behaviorData.MovementDirection,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData, options) {
    super.updateFromNetworkSyncData(networkSyncData, options);
    
    if (networkSyncData.props.RotationSpeed !== undefined)
      this._behaviorData.RotationSpeed = networkSyncData.props.RotationSpeed;
    if (networkSyncData.props.OffsetAngle !== undefined)
      this._behaviorData.OffsetAngle = networkSyncData.props.OffsetAngle;
    if (networkSyncData.props.PreviousX !== undefined)
      this._behaviorData.PreviousX = networkSyncData.props.PreviousX;
    if (networkSyncData.props.PreviousY !== undefined)
      this._behaviorData.PreviousY = networkSyncData.props.PreviousY;
    if (networkSyncData.props.MovementDirection !== undefined)
      this._behaviorData.MovementDirection = networkSyncData.props.MovementDirection;
  }

  // Properties:
  
  _getRotationSpeed() {
    return this._behaviorData.RotationSpeed !== undefined ? this._behaviorData.RotationSpeed : Number("0") || 0;
  }
  _setRotationSpeed(newValue) {
    this._behaviorData.RotationSpeed = newValue;
  }
  _getOffsetAngle() {
    return this._behaviorData.OffsetAngle !== undefined ? this._behaviorData.OffsetAngle : Number("0") || 0;
  }
  _setOffsetAngle(newValue) {
    this._behaviorData.OffsetAngle = newValue;
  }
  _getPreviousX() {
    return this._behaviorData.PreviousX !== undefined ? this._behaviorData.PreviousX : Number("") || 0;
  }
  _setPreviousX(newValue) {
    this._behaviorData.PreviousX = newValue;
  }
  _getPreviousY() {
    return this._behaviorData.PreviousY !== undefined ? this._behaviorData.PreviousY : Number("") || 0;
  }
  _setPreviousY(newValue) {
    this._behaviorData.PreviousY = newValue;
  }
  _getMovementDirection() {
    return this._behaviorData.MovementDirection !== undefined ? this._behaviorData.MovementDirection : Number("0") || 0;
  }
  _setMovementDirection(newValue) {
    this._behaviorData.MovementDirection = newValue;
  }
}

/**
 * Shared data generated from Face forward
 */
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.SharedData = class FaceForwardSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._FaceForward_FaceForwardSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._FaceForward_FaceForwardSharedData = new gdjs.evtsExt__FaceForward__FaceForward.FaceForward.SharedData(
      initialData
    );
  }
  return instanceContainer._FaceForward_FaceForwardSharedData;
}

// Methods:
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final = [];

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects3= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1, gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2);

{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMovementDirection(gdjs.evtTools.common.angleBetweenPositions(eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPreviousX(), eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPreviousY(), (( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[0].getCenterXInScene()), (( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[0].getCenterYInScene())))
}
}

}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1[i].rotateTowardAngle(eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMovementDirection() + eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getOffsetAngle(), Math.abs(eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getRotationSpeed()), runtimeScene);
}
}
}

}


};gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2);
{isConditionTrue_1 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPreviousX() != (( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[0].getCenterXInScene()));
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final.indexOf(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[j]) === -1 )
            gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final.push(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[j]);
    }
}
}
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2);
{isConditionTrue_1 = (eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPreviousY() != (( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[0].getCenterYInScene()));
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final.indexOf(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[j]) === -1 )
            gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final.push(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1_1final, gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1);
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setPreviousX((( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1[0].getCenterXInScene()))
}
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setPreviousY((( gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1[0].getCenterYInScene()))
}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.eventsList1(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;


return;
}
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setRotationSpeed(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeed = function(Value, parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetRotationSpeedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects2= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setOffsetAngle(eventsFunctionContext.getArgument("Value"))
}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngle = function(Value, parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.SetOffsetAngleContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects2= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getRotationSpeed();}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeed = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.RotationSpeedContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects2= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getOffsetAngle();}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngle = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.OffsetAngleContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext = {};
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.idToCallbackMap = new Map();
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects1= [];
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects2= [];


gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{eventsFunctionContext.returnValue = eventsFunctionContext.getObjects("Object")[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMovementDirection();}
}

}


};

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirection = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("FaceForward"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("FaceForward"),
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

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.MovementDirectionContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__FaceForward__FaceForward.FaceForward.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("FaceForward::FaceForward", gdjs.evtsExt__FaceForward__FaceForward.FaceForward);
