/**
 * Created by lkl on 2016/8/12.
 */

var GameLayer = cc.Layer.extend({
    _backgroundLayer:null,
    _thouchLayer:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.addBackGround();
        this.addThouchLayer();

        return true;
    },

    addBackGround:function() {
        this._backgroundLayer = new G_BackGroundLayer();
        this.addChild(this._backgroundLayer);
    },

    addThouchLayer:function() {
        this._thouchLayer = new G_ThouchLayer();
        this.addChild(this._thouchLayer);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var _layer = new GameLayer();
        this.addChild(_layer);
    }
});





