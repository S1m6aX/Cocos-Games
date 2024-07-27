import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

type EnemyData = {
  type: string;
  hp: number;
  speed: number;
  width: number;
  height: number;
  img_fly: string;
  img_hit: string;
  anime: string;
  point: number;
};

@ccclass
export default class EnemyManager extends cc.Component {
  @property(cc.Prefab)
  minionPre: cc.Prefab = null;

  @property(cc.Prefab)
  elitePre: cc.Prefab = null;

  @property(cc.Prefab)
  bossPre: cc.Prefab = null;

  @property(cc.Node)
  EnemyContainer: cc.Node = null;

  @property(cc.Node)
  scoreManager: cc.Node = null;

  @property(cc.Node)
  playerNode: cc.Node = null;

  public isPause: boolean = false;
  private spawnInterval: number = 2; // 初始敌机生成间隔时间
  private spawnTimer: number = 0;
  private difficultyTimer: number = 0;
  private counter: number = 0;

  public minion: EnemyData = {
    type: "Minion",
    hp: 1,
    speed: 200,
    width: 51,
    height: 39,
    img_fly: "/img/enemy1",
    img_hit: "",
    anime: "enemy_down",
    point: 1,
  };

  public elite: EnemyData = {
    type: "Elite",
    hp: 3,
    speed: 150,
    width: 69,
    height: 89,
    img_fly: "/img/enemy2",
    img_hit: "elite_hit",
    anime: "elite_down",
    point: 3,
  };

  public boss: EnemyData = {
    type: "Boss",
    hp: 10,
    speed: 100,
    width: 165,
    height: 246,
    img_fly: "boss_fly",
    img_hit: "boss_hit",
    anime: "boss_down",
    point: 10,
  };

  protected onLoad(): void {
    this.node.active = false;
  }

  start() {
    this.scheduleSpawn();
    this.scheduleSpawn();
  }

  update(dt: number) {
    if (!this.isPause) {
      this.spawnTimer += dt;
      this.difficultyTimer += dt;

      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnEnemy();
      }

      if (this.difficultyTimer >= 30) {
        // 每30秒增加难度
        this.difficultyTimer = 0;
        this.increaseDifficulty();
      }
    }
  }

  spawnEnemy() {
    this.counter++;
    if (this.counter % 5 === 0) {
      this.spawn(this.elite);
    }
    if (this.counter % 20 === 0) {
      this.spawn(this.boss);
    } else {
      this.spawn(this.minion);
    }
  }

  spawn(enemy: EnemyData) {
    let enemyNode = null;
    switch (enemy.type) {
      case "Minion":
        enemyNode = cc.instantiate(this.minionPre);
        break;
      case "Elite":
        enemyNode = cc.instantiate(this.elitePre);
        break;
      case "Boss":
        enemyNode = cc.instantiate(this.bossPre);
        break;
    }

    if (enemyNode) {
      // 随机生成敌人位置
      enemyNode.x = Math.random() * (641 - enemy.width) + enemy.width / 2;

      enemyNode.y = 1136 + enemy.height / 2;
      enemyNode.setParent(this.EnemyContainer);

      // 初始化敌人属性
      enemyNode
        .getComponent(EnemyControl)
        .init(enemy, this.scoreManager, this.playerNode);
    }
  }

  scheduleSpawn() {
    this.schedule(this.update, 0.1); // 更新频率
  }

  increaseDifficulty() {
    this.spawnInterval = Math.max(0.1, this.spawnInterval - 0.2); // 最小间隔时间为0.5秒
    // 可以增加更多的难度调整，如增加敌人的速度、生命值等
  }

  pause() {
    this.isPause = true;
    this.unschedule(this.update); // 停止敌机生成
    // 暂停所有现有敌机
    this.EnemyContainer.children.forEach((child) => {
      const enemyControl = child.getComponent(EnemyControl);
      enemyControl.isPause = true;
    });
  }

  resume() {
    this.isPause = false;
    this.scheduleSpawn(); // 重新开始敌机生成
    // 恢复所有现有敌机
    this.EnemyContainer.children.forEach((child) => {
      const enemyControl = child.getComponent(EnemyControl);
      enemyControl.isPause = false;
    });
  }
}
