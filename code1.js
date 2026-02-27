gdjs.MainMenuCode = {};
gdjs.MainMenuCode.localVariables = [];
gdjs.MainMenuCode.idToCallbackMap = new Map();
gdjs.MainMenuCode.GDPlayButtonObjects1= [];
gdjs.MainMenuCode.GDPlayButtonObjects2= [];
gdjs.MainMenuCode.GDNewTiledSpriteObjects1= [];
gdjs.MainMenuCode.GDNewTiledSpriteObjects2= [];
gdjs.MainMenuCode.GDtitletextObjects1= [];
gdjs.MainMenuCode.GDtitletextObjects2= [];


gdjs.MainMenuCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("PlayButton"), gdjs.MainMenuCode.GDPlayButtonObjects1);
{for(var i = 0, len = gdjs.MainMenuCode.GDPlayButtonObjects1.length ;i < len;++i) {
    gdjs.MainMenuCode.GDPlayButtonObjects1[i].SetLabelTextOp("Play", null);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("PlayButton"), gdjs.MainMenuCode.GDPlayButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.MainMenuCode.GDPlayButtonObjects1.length;i<l;++i) {
    if ( gdjs.MainMenuCode.GDPlayButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.MainMenuCode.GDPlayButtonObjects1[k] = gdjs.MainMenuCode.GDPlayButtonObjects1[i];
        ++k;
    }
}
gdjs.MainMenuCode.GDPlayButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game", false);
}
}

}


};

gdjs.MainMenuCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.MainMenuCode.GDPlayButtonObjects1.length = 0;
gdjs.MainMenuCode.GDPlayButtonObjects2.length = 0;
gdjs.MainMenuCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.MainMenuCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.MainMenuCode.GDtitletextObjects1.length = 0;
gdjs.MainMenuCode.GDtitletextObjects2.length = 0;

gdjs.MainMenuCode.eventsList0(runtimeScene);
gdjs.MainMenuCode.GDPlayButtonObjects1.length = 0;
gdjs.MainMenuCode.GDPlayButtonObjects2.length = 0;
gdjs.MainMenuCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.MainMenuCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.MainMenuCode.GDtitletextObjects1.length = 0;
gdjs.MainMenuCode.GDtitletextObjects2.length = 0;


return;

}

gdjs['MainMenuCode'] = gdjs.MainMenuCode;
