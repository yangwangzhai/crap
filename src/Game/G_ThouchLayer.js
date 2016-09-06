/**
 * Created by lkl on 2016/8/12.
 */

var G_ThouchLayer = cc.Layer.extend({
    sprite: null,
    curr_selected_OBJ: null,//当前选中的押号按钮
    curr_bet_obj: null,//当前选中的下注按钮
    bet_on_obj: null,
    my_YD: null,//我的烟豆
    UI_YD: null,//UI显示的烟豆数
    ZQ_YD: 0,
    show_xz: [],    //游戏底部下注数组
    show_zq: [],    //游戏底部赚取数组
    isRun: false,
    isBetAgain: false,

    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.WinSize = cc.winSize;  //获取当前游戏窗口大小

        this.my_YD = wx_info.total_gold;
        this.UI_YD = wx_info.total_gold;

        this.initBetOnObj();//初始化下注信息

        this.initResultArea();//初始化结果显示区域（骰子转动的部分）

        this.initSelectArea();//初始化押号按钮区域（1,2,3,4,5,6，大，小，单，双）

        this.initBetArea();//初始化下注分值按钮区域（5,10，20,50,100）

        this.initBottomArea();//初始化底部信息区域（押号、下注、赚取）

        this.initCrapsArea();//初始化骰子“开始游戏”区域

        this.schedule(this.updateShow, 0.5);    //定时函数，每0.5秒执行一次updateShow函数

        return true;
    },

    initBetOnObj: function () {
        this.bet_on_obj = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'big': 0, 'small': 0, 'single': 0, 'double': 0};
    },

    initResultArea: function () {
        this._offset = 200;//离中心的偏移量
        this._result_bg = new cc.DrawNode();    //绘图类
        var ltp = cc.p(this.WinSize.width / 2 - this._offset, this.WinSize.height - 100);  //设置矩形的左上角
        var rbp = cc.p(this.WinSize.width / 2 + this._offset, this.WinSize.height - 180);  //设置矩形的右下角
        this._result_bg.drawRect(ltp, rbp, cc.color(237, 60, 55)); //绘制矩形
        this._result_bg.setVisible(false);
        this.addChild(this._result_bg);

        //文字内容
        this._text_pre = new cc.LabelTTF('本次开', 'Arial', 30);   //创建文字以及文字属性
        this._text_pre.attr({
            anchorX: 0,
            anchorY: 0.5
        });
        this._text_pre.setPosition(this.WinSize.width / 2 - this._offset, this.WinSize.height - 140);//设置文字的位置
        this._text_pre.setVisible(false);   //设置节点是否可见：true可见，false不可见
        this.addChild(this._text_pre);

        var text_pre_wh = this._text_pre.getContentSize();//this._text_pre的宽高；返回节点未变形状态下的大小（宽和高）。
        var text_pre_p = this._text_pre.getPosition();

        //骰子点数
        //getRect():返回一个矩形区域
        //Sprite(filename,rect):使用图片文件和指定的矩形区域创建一个 Sprite。
        this._craps_result = new cc.Sprite(res.s_1to6, this.getRect(1));
        this._craps_result.attr({
            x: text_pre_p.x + text_pre_wh.width + 5,
            y: text_pre_p.y,
            scale: 0.7,
            anchorX: 0
        });
        this._craps_result.setVisible(false);
        this.addChild(this._craps_result);

        var craps_result_wh = this._craps_result.getBoundingBox();//this._text_pre的宽高
        var craps_result_p = this._craps_result.getPosition();

        this._text_end = new cc.LabelTTF(', 赢 8888 烟豆', 'Arial', 30);
        this._text_end.attr({
            anchorX: 0,
            x: craps_result_p.x + craps_result_wh.width + 5,
            y: text_pre_p.y
        });
        this._text_end.setVisible(false);
        this.addChild(this._text_end);
    },

    initSelectArea: function () {
        var padding_left = 60;
        var padding_right = this.WinSize.width - 60;
        var margin_top = 80;
        var PositionY_L = this.WinSize.height - 50;
        var PositionY_R = this.WinSize.height - 50;

        //创建图片菜单项cc.MenuItemImage对象
        this._select_1 = new cc.MenuItemImage(res.s_count1,res.s_count1, this.selectCallBack, this);
        this._select_1.attr({
            x: padding_left,
            y: PositionY_L,
            num: '1'
        });

        this._select_2 = new cc.MenuItemImage(res.s_count2,res.s_count2, this.selectCallBack, this);
        this._select_2.attr({
            x: padding_left,
            y: PositionY_L - (1 * margin_top),
            num: '2'
        });

        this._select_3 = new cc.MenuItemImage(res.s_count3,res.s_count3, this.selectCallBack, this);
        this._select_3.attr({
            x: padding_left,
            y: PositionY_L - (2 * margin_top),
            num: '3'
        });

        this._select_4 = new cc.MenuItemImage(res.s_count4,res.s_count4, this.selectCallBack, this);
        this._select_4.attr({
            x: padding_left,
            y: PositionY_L - (3 * margin_top),
            num: '4'
        });

        this._select_5 = new cc.MenuItemImage(res.s_count5,res.s_count5, this.selectCallBack, this);
        this._select_5.attr({
            x: padding_left,
            y: PositionY_L - (4 * margin_top),
            num: '5'
        });

        this._select_6 = new cc.MenuItemImage(res.s_count6,res.s_count6, this.selectCallBack, this);
        this._select_6.attr({
            x: padding_left,
            y: PositionY_L - (5 * margin_top),
            num: '6'
        });

        this._select_big = new cc.MenuItemImage(res.s_countbig,res.s_countbig, this.selectCallBack, this);
        this._select_big.attr({
            x: padding_right,
            y: PositionY_R - (1 * margin_top),
            num: 'big'
        });

        this._select_small = new cc.MenuItemImage(res.s_countsmall,res.s_countsmall, this.selectCallBack, this);
        this._select_small.attr({
            x: padding_right,
            y: PositionY_R - (2 * margin_top),
            num: 'small'
        });

        this._select_single = new cc.MenuItemImage(res.s_countsingle,res.s_countsingle, this.selectCallBack, this);
        this._select_single.attr({
            x: padding_right,
            y: PositionY_R - (3 * margin_top),
            num: 'single'
        });

        this._select_double = new cc.MenuItemImage(res.s_countdouble,res.s_countdouble, this.selectCallBack, this);
        this._select_double.attr({
            x: padding_right,
            y: PositionY_R - (4 * margin_top),
            num: 'double'
        });

        this._select_menu = new cc.Menu(this._select_1, this._select_2, this._select_3, this._select_4, this._select_5, this._select_6, this._select_big, this._select_small,this._select_single,this._select_double);
        this._select_menu.attr({
            x: 0,
            y: 0
        });
        this.addChild(this._select_menu);
    },

    initBetArea: function () {
        var margin_L_R = 120;
        var PositionY = this.WinSize.height / 2 - 70;


        this._bet_5 = new cc.MenuItemImage(res.s_bet5,res.s_bet5, this.betCallBack, this);
        this._bet_5.attr({
            x: this.WinSize.width/2  - (2 * margin_L_R),
            y: PositionY,
            bet_num: 5
        });

        this._bet_10 = new cc.MenuItemImage(res.s_bet10,res.s_bet10, this.betCallBack, this);
        this._bet_10.attr({
            x: this.WinSize.width/2  - (1 * margin_L_R),
            y: PositionY,
            bet_num: 10
        });

        this._bet_20 = new cc.MenuItemImage(res.s_bet20,res.s_bet20, this.betCallBack, this);
        this._bet_20.attr({
            x: this.WinSize.width/2,
            y: PositionY,
            bet_num: 20
        });

        this._bet_50 = new cc.MenuItemImage(res.s_bet50,res.s_bet50, this.betCallBack, this);
        this._bet_50.attr({
            x: this.WinSize.width/2 + (1 * margin_L_R),
            y: PositionY,
            bet_num: 50
        });

        this._bet_100 = new cc.MenuItemImage(res.s_bet100,res.s_bet100, this.betCallBack, this);
        this._bet_100.attr({
            x: this.WinSize.width/2 + (2 * margin_L_R),
            y: PositionY,
            bet_num: 100
        });



        this._bet_menu = new cc.Menu(this._bet_5, this._bet_10, this._bet_20, this._bet_50, this._bet_100);
        this._bet_menu.attr({
            x: 0,
            y: 0
        });
        this.addChild(this._bet_menu);
    },

    initBottomArea: function () {
        //先添加绿色背景
        this._bottomArea = new cc.Sprite(res.s_bottom_bg);
        this._bottomArea.attr({
            x: this.WinSize.width / 2,
            y: 220,
            anchorY: 0
        });
        this.addChild(this._bottomArea);

        var fontColor = new cc.Color(255, 255, 0);  //实列化颜色对象
        //押号
        var arr = ['押号', '1', '2', '3', '4', '5', '6', '大', '小','单','双'];
        var x_offset = 50;
        for (var i in arr) {
            var _yh = new cc.LabelTTF(arr[i], 'Arial', 24);
            _yh.attr({
                x: 35 + (i * x_offset),
                y: this._bottomArea.height - 10,
                anchorX: 0.5,
                anchorY: 1
            });
            _yh.setColor(fontColor);    //给_yh对象设置颜色

            this._bottomArea.addChild(_yh);
        }

        //下注
        var arr = ['下注', '0', '0', '0', '0', '0', '0', '0', '0','0','0'];

        for (var i in arr) {
            var _xz = new cc.LabelTTF(arr[i], 'Arial', 24);
            _xz.attr({
                x: 35 + (i * x_offset),
                y: this._bottomArea.height / 2,
                anchorX: 0.5,
                anchorY: 0.5
            });
            _xz.setColor(fontColor);
            this.show_xz.push(_xz);
            this._bottomArea.addChild(_xz);
        }

        //赚取
        var arr = ['赚取', '0', '0', '0', '0', '0', '0', '0', '0','0','0'];

        for (var i in arr) {
            var _zq = new cc.LabelTTF(arr[i], 'Arial', 24);
            _zq.attr({
                x: 35 + (i * x_offset),
                y: 10,
                anchorX: 0.5,
                anchorY: 0
            });
            _zq.setColor(fontColor);
            this.show_zq.push(_zq);
            this._bottomArea.addChild(_zq);
        }

    },

    initCrapsArea: function () {
        this._startBTN = new cc.MenuItemFont('开始', this.startCallBack, this);//创建cc.MenuItemFont菜单项对象
        this._startBTN.attr({
            x: this.WinSize.width / 2 + 100,
            y: 50
        });

        this._startMenu = new cc.Menu(this._startBTN);
        this._startMenu.attr({x: 0, y: 0});
        this.addChild(this._startMenu);

        //骰子
        cc.spriteFrameCache.addSpriteFrames(res.s_craps_plist);//缓存图片

        this._craps = new cc.Sprite('#1.png');//把骰子点数为 1 的图片设置为精灵
        this._craps.attr({
            x: this.WinSize.width / 2,
            y: this.WinSize.height / 2 + 150
        });
        this.addChild(this._craps);

        //创建动画
        var animation = new cc.Animation();
        for (var i = 1; i <= 6; i++) {
            var frameName = i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);//创建精灵帧对象
            animation.addSpriteFrame(spriteFrame);
        }

        animation.setDelayPerUnit(0.1);           //设置两个帧播放时间
        //animation.setRestoreOriginalFrame(true);    //动画执行后还原初始状态

        this._crapsAction = cc.animate(animation);
        //this.sprite.runAction(cc.repeatForever(action));


    },

    selectCallBack: function (sender) {//押号选择回调函数
        if (this.curr_selected_OBJ != null) {
            this.curr_selected_OBJ.setColor(cc.color(255, 255, 255));
        }

        if (this.curr_bet_obj != null) {
            this.curr_bet_obj.setColor(cc.color(255, 255, 255));
            this.curr_bet_obj = null;
        }
        sender.setColor(cc.color(255, 0, 0));//点击改变按钮字体颜色
        this.curr_selected_OBJ = sender;

    },

    betCallBack: function (sender) {//押注选择回调函数
        if(this.isBetAgain){
            this.initBetOnObj();
            this.isBetAgain = false;
        }
        if (this.curr_selected_OBJ != null) {
            //UI变化操作
            if (this.curr_bet_obj != null) {
                this.curr_bet_obj.setColor(cc.color(255, 255, 255));

            }

            sender.setColor(cc.color(255, 0, 0));//点击改变按钮字体颜色
            this.curr_bet_obj = sender;

            //下注逻辑
            if (this.checkYD(this.curr_bet_obj.bet_num)) {//检查烟豆是否够下注
                this.bet_on_obj[this.curr_selected_OBJ.num] += this.curr_bet_obj.bet_num;//把当前下注值存到bet_on_obj数组对象中
                this.UI_YD -= this.curr_bet_obj.bet_num;
                /*cc.log('bet_on_obj');
                cc.log(this.bet_on_obj);
                cc.log(this.UI_YD);*/
            } else {
                alert('烟豆不足！');
            }

        } else {
            alert('请选择号码');
        }


    },

    startCallBack: function () {
        var self = this;
        if (!this.isRun) {

            if(this.checkBetArr(this.bet_on_obj)){//检查是否下注
                var sum = 0;
                for (var i in this.bet_on_obj) {
                    sum += this.bet_on_obj[i];
                }

                if (this.my_YD >= sum) {//检查是否够烟豆

                    this._craps.runAction(cc.repeatForever(this._crapsAction));//启动动画
                    this.playEffect();//播放音效
                    this.isRun = true;
                    if(this.isBetAgain){
                        this.UI_YD -= sum;
                    }
                    self.resultAreaHide();//隐藏结果
                    cc.log(this.postData(this.bet_on_obj));
                    //发送下注信息到后台并返回结果
                    var xhr = cc.loader.getXMLHttpRequest();
                    xhr.open("POST", "index.php?c=craps&m=betOn");
                    //set Content-type "text/plain;charset=UTF-8" to post plain text
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status >= 200 && xhr.status <= 207) {
                                cc.log(xhr.responseText);
                                var response = eval("("+xhr.responseText+")");//接收服务器返回结果
                                if(response.Code == 0){//code == 0 表示下注并结算成功
                                    self.scheduleOnce(function(){//收到结果后延时5秒再显示结果

                                        self.isBetAgain = true;//改变重复下注状态
                                        self.my_YD = self.UI_YD = response.My_YD;//更新烟豆信息
                                        //initWithFile(filename,rect)使用指定图片文件的特定矩形区域初始化一个精灵。
                                        //getRect():返回一个矩形区域
                                        self._craps_result.initWithFile(res.s_1to6, this.getRect(response.Count));
                                        var num = 0;
                                        for(var i in response.result){
                                            num += response.result[i];
                                        }
                                        if(num < 0){
                                            self._text_end.setString(', 输 '+Math.abs(num)+' 烟豆');//更新本局输赢烟豆信息
                                        }else{
                                            self._text_end.setString(', 赢 '+Math.abs(num)+' 烟豆');
                                        }

                                        self.ZQ_YD += num;

                                        self.updateShowZQ(response.result);//更新赚取烟豆明细信息

                                        self.resultAreaShow();//显示结果

                                        self._craps.stopAllActions();//停止骰子动画
                                        self._craps.initWithSpriteFrameName(response.Count+".png");//显示最终结果在骰子上
                                        self.isRun = false;
                                        cc.audioEngine.pauseAllEffects();//停止要骰子音效
                                    },5);
                                }else{
                                    self._craps.stopAllActions();
                                    self.isRun = false;
                                    cc.audioEngine.pauseAllEffects();
                                    alert(response.Msg);
                                }





                            } else {
                                self._craps.stopAllActions();
                                self.isRun = false;
                                cc.audioEngine.pauseAllEffects();
                                alert('网络故障，请稍后再试试~');
                            }

                        }
                    };


                    xhr.send(this.postData(this.bet_on_obj));//发送下注信息到服务器

                }else{
                    alert('烟豆不足');
                }
            }else{
                alert('您还没下注！');
            }

        } else {
            this._craps.stopAllActions();
            this.isRun = false;
        }

    },

    checkYD: function (bet_num) {
        if (!bet_num) {
            return false;
        }

        //已经下注的烟豆总数
        var sum = 0;
        for (var i in this.bet_on_obj) {
            sum += this.bet_on_obj[i];
        }
        //判断，若用户烟豆>=下注的总数
        if (this.my_YD >= sum + bet_num) {
            return true;
        }
        return false;
    },

    //检查是否下注（只要检测到“下注数组”里面有某个 > 0 即认为已经下注）
    checkBetArr : function (obj) {
        var res = false;
        for(var i in obj){
            if(obj[i] > 0){
                res = true;
            }
        }
        return res;
    },

    updateShow: function () {
        BG_Object._mybean.setString('我的烟豆：' + this.UI_YD);//更新烟豆

        BG_Object._mywinbean.setString('赚取'+this.ZQ_YD+'烟豆');

        //更新下注信息
        for (var i in this.show_xz) {
            //cc.log(i);
            if (i > 0) {
                var index = i;
                if (i == 7) {
                    index = 'big';
                } else if (i == 8) {
                    index = 'small';
                } else if (i == 9) {
                    index = 'single';
                } else if (i == 10) {
                    index = 'double';
                }
                this.show_xz[i].setString(this.bet_on_obj[index]); //设置文本框中的文本
            }

        }
    },

    //更新赚取烟豆信息
    updateShowZQ: function (data) {
        for(var i in this.show_zq){
            if(i > 0){
                var index = i;
                if (i == 7) {
                    index = 'Big';
                } else if (i == 8) {
                    index = 'Small';
                } else if (i == 9) {
                    index = 'Single';
                } else if (i == 10) {
                    index = 'Double';
                }
                this.show_zq[i].setString(data['Bet'+index]);
            }
        }
    },

    //获取点数rect。rect(x,y,width,heigth)获取一个矩形区域
    getRect: function (num) {
        var num1 = parseInt(num);
        if (0 < num1 < 7) {
            return cc.rect((num1 - 1) * 100, 0, 100, 97);
        }
        return false;

    },

    postData: function (data) {
        //  var data = {data:'我是你'};
        var params = "openid="+wx_info.openid+"&gamekey="+wx_info.gamekey+"&";
        if (typeof(data) == "object") {
            for (var key in data) {
                params += (key + "=" + data[key] + "&");
            }
        } else {
            params = data;
        }
        return params;
    },

    //显示结果
    resultAreaShow : function() {
        cc.log('show');
        this._result_bg.setVisible(true);
        this._text_pre.setVisible(true);
        this._craps_result.setVisible(true);
        this._text_end.setVisible(true);
    },

    //隐藏结果
    resultAreaHide : function() {
        cc.log('hide');
        this._result_bg.setVisible(false);
        this._text_pre.setVisible(false);
        this._craps_result.setVisible(false);
        this._text_end.setVisible(false);
    },

    //播放音效
    playEffect : function() {
        if(AllowMusic){
            cc.audioEngine.playEffect(res.s_yao,true);
        }
    }
});


