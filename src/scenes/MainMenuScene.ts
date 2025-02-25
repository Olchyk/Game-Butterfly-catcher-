import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  preload() {
    this.load.image("background", "assets/background/backgroundfirst.jpeg");
    this.load.audio("menuMusic", "assets/audio/background.mp3");
    this.load.spritesheet("butterfly", "assets/items/butterfly.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("blueButterfly", "assets/items/blue_butterfly.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    const background = this.add.image(0, 0, "background");
    background.setOrigin(0, 0);
    background.setDisplaySize(this.scale.width, this.scale.height);

    this.scale.on("resize", (gameSize: { width: number; height: number }) => {
      background.setDisplaySize(gameSize.width, gameSize.height);
      startButton.setPosition(gameSize.width / 2, gameSize.height / 2);
    });

    // ✅ Завантажуємо музику, але НЕ запускаємо її одразу
    const music = this.sound.add("menuMusic", { loop: true, volume: 0.5 });

    const titleText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height * 0.25,
        "🦋 Лови метеликів 🦋",
        {
          fontSize: `${Math.max(40, this.scale.width * 0.005)}px`, // Масштабуємо шрифт
          color: "#FF116B",
          fontFamily: "'Tiny5', serif",
        }
      )
      .setOrigin(0.5);

    const startButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "▶ Розпочати гру", {
        fontSize: "28px",
        color: "#8000ff",
        fontFamily: "'Tiny5', serif",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    startButton.on("pointerdown", () => {
      if (this.sound instanceof Phaser.Sound.WebAudioSoundManager) {
        if (this.sound.context.state === "suspended") {
          this.sound.context.resume().then(() => {
            console.log("🔊 Аудіо активовано");
            music.play();
          });
        } else {
          music.play();
        }
      } else {
        music.play();
      }

      this.scene.start("SelectDifScene");
    });

    if (!this.anims.exists("fly")) {
      this.anims.create({
        key: "fly",
        frames: this.anims.generateFrameNumbers("butterfly", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    for (let i = 0; i < 20; i++) {
      this.spawnFlyingButterfly();
    }

    const { width, height } = this.scale;

    const historyButton = this.add
      .text(width / 2, height / 2 + 70, "📜 Історія очок", {
        fontSize: "26px",
        color: "#0F7BB0",
        fontFamily: "'Tiny5', serif",
      })
      .setOrigin(0.5)
      .setInteractive();

    historyButton.on("pointerdown", () => {
      this.scene.start("ScoreHistoryScene");
    });
  }

  spawnFlyingButterfly() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const y = Phaser.Math.Between(50, this.scale.height - 50);

    const butterfly = this.add
      .sprite(x, y, "butterfly")
      .setScale(2)
      .play("fly");

    this.tweens.add({
      targets: butterfly,
      x: "+=" + Phaser.Math.Between(-150, 150),
      y: "+=" + Phaser.Math.Between(-50, 50),
      duration: Phaser.Math.Between(2500, 4000),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const flightType = Phaser.Math.Between(1, 3);

    if (flightType === 1) {
      // 🌀 Хаотичний рух
      this.tweens.add({
        targets: butterfly,
        x: "+=" + Phaser.Math.Between(-200, 200),
        y: "+=" + Phaser.Math.Between(-100, 100),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    } else if (flightType === 2) {
      // 🔄 Круговий рух
      this.tweens.add({
        targets: butterfly,
        x: "+=" + Phaser.Math.Between(-100, 100),
        y: "+=" + Phaser.Math.Between(-100, 100),
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        rotation: "+=0.1",
      });
    } else {
      this.tweens.add({
        targets: butterfly,
        y: "+=" + Phaser.Math.Between(-150, 150),
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }
}
