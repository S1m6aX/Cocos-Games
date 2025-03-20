import {
  _decorator,
  Component,
  Node,
  Label,
  Button,
  Vec3,
  tween,
  Tween,
  easing,
  view,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("guess_cup")
export class guess_cup extends Component {
  @property(Node)
  private _safe_node: Node = null; // 小游戏Node节点

  @property([Node])
  private _arr_cup_item: Node[] = []; // 5个杯子

  private _arr_cup_origin_pos: Vec3[] = []; // 5个原始位置，复位的时候用到

  @property([Label])
  private _arr_lbl_num: Label[] = []; // 5个筹码对应的奖励金

  @property([Button])
  private _arr_btn_cup: Button[] = []; // 5个按键

  @property(Node)
  private _spr_result: Node = null; // 结算界面

  @property(Node)
  private _btn_again: Node = null; // 确定

  @property(Label)
  private _lbl_reward: Label = null; // 结算框中奖数组Label

  private _str_bei: string = "倍"; // 倍字
  private _resultIndex: number = 0; // 奖金池索引
  private _rate: number = 0; // 赢得的金币
  private _arrCupData: number[] = []; // 1行5列数组
  private _selectCupID: number = -1; // 记录用户选中的杯子ID
  private _shuffleCount: number = 12; // 洗牌次数
  private readonly _CUP_TOP_Y: number = 76.5;
  private readonly _CUP_BOTTOM_Y: number = -40;

  onLoad() {
    this.initPrivateVar();
    this.startGame();
  }

  // 初始化私有变量
  initPrivateVar() {
    this._safe_node = this.node.getChildByName("safe_node");
    this.setNodeScaleFixWin(this._safe_node);

    this._spr_result = this._safe_node.getChildByName("spr_result");
    this._btn_again = this._spr_result.getChildByName("btn_again");
    this._btn_again.on(Button.EventType.CLICK, this.onClickAgain, this);

    this._lbl_reward = this._spr_result
      .getChildByName("lbl_reward")
      .getComponent(Label);

    for (let i = 0; i < 5; i++) {
      this._arr_cup_item[i] = this._safe_node.getChildByName(
        `node_cup/cup_item${i}`
      );
    }

    for (let i = 0; i < 5; i++) {
      console.log(this._arr_cup_item[i].position);
      this._arr_cup_origin_pos[i] = this._arr_cup_item[i].position.clone();
    }

    for (let i = 0; i < 5; i++) {
      this._arr_lbl_num[i] = this._arr_cup_item[i]
        .getChildByName("lbl_reward_num")
        .getComponent(Label);
    }

    for (let i = 0; i < 5; i++) {
      const btnCup = this._arr_cup_item[i]
        .getChildByName("btn_cup")
        .getComponent(Button);
      btnCup.node["mytag"] = i; // mytag记录 这个杯子所作的位置 [0, 4]
      btnCup.node.on(Button.EventType.CLICK, this.onClickGuessCup, this);
      this._arr_btn_cup[i] = btnCup;
    }
  }

  resetGame() {
    console.log("重新开始游戏~~~~ ");
    this._spr_result.active = false;

    // 位置复位
    for (let i = 0; i < 5; i++) {
      this._arr_cup_item[i].position = this._arr_cup_origin_pos[i].clone();
      this._arr_btn_cup[i].node.position = new Vec3(
        this._arr_btn_cup[i].node.position.x,
        this._CUP_TOP_Y,
        0
      );
    }

    this.enableBtnCup(false);

    this._rate = 0;
    this._lbl_reward.string = "0";

    this._selectCupID = -1;

    tween(this.node).stop();
  }

  // 开始游戏逻辑
  startGame() {
    this._spr_result.active = false;
    this._shuffleCount = this.myRandom(10, 15); // 洗牌次数
    this._arrCupData = [1, 5, 10, 5, 1]; // 中奖倍数
    for (let i = 0; i < this._arr_lbl_num.length; i++) {
      this._arr_lbl_num[i].string = this._arrCupData[i] + this._str_bei;
    }

    // 等待动画完成后才使能
    this.enableBtnCup(false);

    // 翻开所有的杯子，
    for (let i = 0; i < 5; i++) {
      this._arr_btn_cup[i].node.position = new Vec3(
        this._arr_btn_cup[i].node.position.x,
        this._CUP_TOP_Y,
        0
      );
    }

    // 停留2.0秒后扣住杯子
    tween(this.node)
      .delay(2.0)
      .call(() => {
        this.doCoverCupAction();
      })
      .start();
  }

  // 控制杯子cup按键是否可以被点击
  enableBtnCup(bEnableBtn: boolean) {
    for (let i = 0; i < this._arr_btn_cup.length; i++) {
      this._arr_btn_cup[i].interactable = bEnableBtn;
    }
  }

  // 玩家选择了某个杯子----
  onClickGuessCup(event: Event, customData: any) {
    this.enableBtnCup(false);
    const buttonNode = event.target;

    this._selectCupID = buttonNode["mytag"];
    this._rate = this._arrCupData[this._selectCupID];

    // [开奖操作]
    this.doOpenCupAction();
  }

  // [开奖操作] 翻开杯子的动画
  doOpenCupAction() {
    const duration = 0.3;
    const xx = this._arr_btn_cup[this._selectCupID].node.position.x;
    tween(this._arr_btn_cup[this._selectCupID].node)
      .to(
        duration,
        { position: new Vec3(xx, this._CUP_TOP_Y, 0) },
        { easing: easing.quadOut }
      )
      .delay(2)
      .call(() => {
        this.enableBtnCup(false); // 关闭按键
        this.showResult(); // 显示结算框
      })
      .start();
  }

  // 重新开始游戏-----产生一个
  onClickAgain() {
    this.resetGame();
    this.startGame();
  }

  // 下落动画 this._arr_btn_cup _CUP_BOTTOM_Y
  doCoverCupAction() {
    const duration = 0.3;
    for (let i = 0; i < 5; i++) {
      const xx = this._arr_btn_cup[i].node.position.x;
      tween(this._arr_btn_cup[i].node)
        .to(
          duration,
          { position: new Vec3(xx, this._CUP_BOTTOM_Y, 0) },
          { easing: easing.quadIn }
        )
        .start();
    }

    tween(this.node)
      .delay(duration + 0.5)
      .call(() => {
        // 然后开始打乱顺序
        this.doUpsetOrder01();
      })
      .start();
  }

  // 打乱顺序动画，交换杯子的动画效果
  // 合并到中间
  doUpsetOrder01() {
    const duration = 0.35;
    const centerIndex = 2;
    for (let i = 0; i < 5; i++) {
      const xx = this._arr_cup_item[centerIndex].position.x;
      const yy = this._arr_cup_item[centerIndex].position.y;
      tween(this._arr_cup_item[i])
        .to(
          duration,
          { position: new Vec3(xx, yy, 0) },
          { easing: easing.quadIn }
        )
        .start();
    }

    tween(this.node)
      .delay(duration + 0.025)
      .call(() => {
        this.doUpsetOrder02();
      })
      .start();
  }

  // 02 从中散开
  doUpsetOrder02() {
    const duration = 0.35;

    // 散开动画----位置下标
    let arrPosIndex = [0, 1, 2, 3, 4];
    arrPosIndex = this.shuffleData(arrPosIndex); // 打乱顺序

    // 打乱顺序 this._arr_cup_origin_pos
    for (let i = 0; i < 5; i++) {
      const newIndex = arrPosIndex[i];
      const newPos = this._arr_cup_origin_pos[newIndex].clone();
      tween(this._arr_cup_item[i])
        .to(duration, { position: newPos }, { easing: easing.quadIn })
        .start();
    }

    tween(this.node)
      .delay(duration + 0.025)
      .call(() => {
        this._shuffleCount--;
        if (this._shuffleCount <= 0) {
          this.enableBtnCup(true); // 使能按键
        } else {
          this.doUpsetOrder02();
        }
      })
      .start();
  }

  // 显示结算面板
  showResult() {
    this._spr_result.active = true;
    this._lbl_reward.string = this._rate + "倍";
  }

  // 打乱数组顺序
  shuffleData(arrData: any[]) {
    let m = arrData.length;
    while (m) {
      const i = (Math.random() * m--) >>> 0;
      // ES6语法，交换数组元素
      [arrData[m], arrData[i]] = [arrData[i], arrData[m]];
    }
    return arrData;
  }

  // 屏幕适配缩放函数
  setNodeScaleFixWin(node: Node) {
    const visibelSize = view.getVisibleSize();
    node.setScale(
      visibelSize.width / node.getComponent(UITransform).width,
      visibelSize.height / node.getComponent(UITransform).height,
      1
    );
  }

  // 产生 [min, max] 之间的正整数
  myRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
