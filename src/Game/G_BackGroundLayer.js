/**
 * Created by lkl on 2016/8/12.
 */

var BG_Object = null;
var G_BackGroundLayer = cc.Layer.extend({
    sprite:null,
    _Avatar : null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        BG_Object = this;
        this.WinSize = cc.winSize;
        this.my_win_bean = 0;

        this.initBackGround();
        this.initHeader();

        return true;
    },

    initBackGround : function() {
        this._bg = new cc.Sprite(res.S_bg);
        this._bg.attr({
            x:this.WinSize.width/2,
            y:this.WinSize.height/2
        });
        this.addChild(this._bg);

    },

    initHeader : function() {
        /*this._Header_bg = new cc.DrawNode();
        var ltp = cc.p(0, this.WinSize.height);
        var rbp = cc.p(this.WinSize.height, this.WinSize.height - 80);
        this._Header_bg.drawRect(ltp, rbp, cc.color(233,158,57));
        this.addChild(this._Header_bg);*/


        var self = this;
        //微信头像
        cc.loader.loadImg(wx_info.imgUrl, {isCrossOrigin : false }, function(err, img)
        {
            self._Avatar = new cc.Sprite(img);
            self._Avatar.attr({
                anchorX : 0.5,
                anchorY : 0.5
            });
            self._Avatar.setPosition(73,70);
            self.addChild(self._Avatar);

        }.bind(this));


        //微信昵称
        this._NickName_label = new cc.LabelTTF('微信昵称：'+wx_info.nickname,'Arial',20);
        this._NickName_label.attr({
            anchorX : 0,
            anchorY : 0.5
        });
        this._NickName_label.setPosition(135,100);
        this.addChild(this._NickName_label);

        //我的烟豆
        this._mybean = new cc.LabelTTF('我的烟豆：'+wx_info.total_gold,'Arial',20);
        this._mybean.attr({
            anchorX : 0,
            anchorY : 0.5
        });
        this._mybean.setPosition(135,65);
        this.addChild(this._mybean);

        //总共赚取烟豆
        this._mywinbean = new cc.LabelTTF('赚取'+this.my_win_bean+'烟豆','Arial',20);
        this._mywinbean.attr({
            anchorX : 0,
            anchorY : 0.5
        });
        this._mywinbean.setPosition(135,30);
        this.addChild(this._mywinbean);

    }
});

