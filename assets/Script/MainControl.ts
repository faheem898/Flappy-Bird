// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioSourceControl from "./AudioSourceControl";

const {ccclass, property} = cc._decorator;


export enum GameStatus{
    Game_Ready = 0,
    Game_Playing,
    Game_Over
}

console.log(GameStatus);


@ccclass
export default class MainControl extends cc.Component {

    @property(cc.Sprite)
    spBg: cc.Sprite[] = [null,null];

    @property(cc.Prefab)
    pipePrefab: cc.Prefab = null;

    pipe: cc.Node[] = [null, null, null]

    spGameOver: cc.Sprite = null;

    btnStart: cc.Button = null;

    gameStatus: GameStatus= GameStatus.Game_Ready

    @property(cc.Label)
    labelScore: cc.Label = null;

    gameScore: number=0;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    

    update (dt: number) {

        if(this.gameStatus !== GameStatus.Game_Playing){
            return;
        }


        for(let i=0; i<this.spBg.length; i++)
        {
            this.spBg[i].node.x -= 1;
            if (this.spBg[i].node.x <= -900) {
                this.spBg[i].node.x = 900;
            }

        }
        
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x -= 1.0;
            if (this.pipe[i].x <= -170) {
                this.pipe[i].x = 430;

                var minY = -120;
                var maxY = 120;
                this.pipe[i].y = minY + Math.random() * (maxY - minY);
            }
        }
    }

    gameOver () {
        this.spGameOver.node.active = true;

        this.btnStart.node.active = true;

        this.gameStatus = GameStatus.Game_Over;

    }   

    start () {
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i] = cc.instantiate(this.pipePrefab);
            this.node.getChildByName("Pipe").addChild(this.pipe[i]);

            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY - minY);
        }
    }

    onLoad() {
        // open Collision System
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        // open debug draw when you debug the game
        // do not forget to close when you ship the game
      
        // find the GameOver node, and set active property to false
        this.spGameOver = this.node.getChildByName("GameOver").getComponent(cc.Sprite);
        this.spGameOver.node.active = false;

        this.btnStart = this.node.getChildByName("BtnStart").getComponent(cc.Button);

        this.btnStart.node.on(cc.Node.EventType.TOUCH_END, this.touchStartBtn, this);
    } 
    
    touchStartBtn(){
        this.btnStart.node.active= false;
        this.gameStatus = GameStatus.Game_Playing;
        this.spGameOver.node.active= false;

        for(let i=0; i<this.pipe.length; i++){
            this.pipe[i].x=170*200*i;
            var minY=-120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY - minY);
        }
        var bird = this.node.getChildByName("Bird");
        bird.y = 0;
        bird.rotation = 0;

        this.gameScore = 0;this.labelScore.string = this.gameScore.toString();
    }

    onCollisionEnter (other: cc.Collider, self: cc.Collider) {
        //game over
        cc.log("game over");
    } 
}
