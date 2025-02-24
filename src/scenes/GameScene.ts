import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = 30;
  private difficulty: string = "medium";
  private backgroundKey: string = "backgroundMedium";

  private catcher!: Phaser.Physics.Arcade.Sprite; // ✅ Додаємо catcher
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // ✅ Додаємо керування
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bats!: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "GameScene" }); // ✅ Оголошуємо ключ сцени
  }

  init(data: any) {
    this.bats = undefined as any;
    console.log("Отримані дані:", data); // ✅ Додано для перевірки

    if (!data || !data.difficulty) {
      console.error(
        "Помилка: не отримано рівень складності, встановлено за замовчуванням."
      );
      this.difficulty = "medium";
    } else {
      this.difficulty = data.difficulty;
    }

    if (this.difficulty === "easy") {
      this.timeLeft = 40;
    } else if (this.difficulty === "hard") {
      this.timeLeft = 20;
    } else {
      this.timeLeft = 30;
    }

    // 📌 Отримуємо рівень складності з registry
    this.difficulty = data.difficulty || "unknown";
    this.registry.set("difficulty", this.difficulty); // ✅ Збереження рівня складності

    if (this.difficulty === "easy") {
      this.timeLeft = 40;
      this.backgroundKey = "backgroundEasy";
    } else if (this.difficulty === "hard") {
      this.timeLeft = 20;
      this.backgroundKey = "backgroundHard";
    } else {
      this.timeLeft = 30;
      this.backgroundKey = "backgroundMedium";
    }
  }

  preload() {
    console.log("📥 Завантаження ресурсів у GameScene...");
    console.log("📥 Чи завантажений catcher?", this.textures.exists("catcher"));

    this.load.spritesheet("butterfly", "assets/items/butterfly.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("blueButterfly", "assets/items/butterfly-blue.png", {
      frameWidth: 65,
      frameHeight: 65,
    });
    this.load.image("catcher", "assets/items/catcher.png");
    this.load.image("platform", "assets/items/steelstrip.png");
    this.load.image("backgroundEasy", "assets/background/morning-back.jpeg");
    this.load.image("backgroundMedium", "assets/background/day-back.jpeg");
    this.load.image("backgroundHard", "assets/background/dark-back.jpeg");

    this.load.once("complete", () => {
      console.log("✅ Всі ресурси завантажені успішно!");
    });

    this.load.spritesheet("bat", "assets/items/bat.png", {
      frameWidth: 32, // 🔹 Вказуємо розмір кадру (залежить від спрайта)
      frameHeight: 32,
    });

    this.load.once("complete", () => {
      console.log("✅ Всі ресурси завантажені успішно!");
    });

    console.log("📥 Завантаження завершено!");
  }

  create() {
    console.log("🎮 create() GameScene запущено!");

    if (!this.scene || !this.add) {
      console.error("⚠️ Scene context не ініціалізований!");
      return;
    }

    console.log(this.add); // ✅ Перевіряємо, чи доступний this.add

    if (!this.add) {
      console.error("⚠️ this.add ще не ініціалізований!");
      return;
    }

    this.events.on("shutdown", () => {
      this.score = 0; // ❗ Очистка очок при завершенні сцени
    });

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("butterfly", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "flyBlue",
      frames: this.anims.generateFrameNumbers("blueButterfly", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    const background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      this.backgroundKey
    );
    background.setDisplaySize(this.scale.width, this.scale.height);
    background.setOrigin(0.5);

    // ✅ Додаємо реакцію на зміну розміру
    this.scale.on("resize", (gameSize: any) => {
      background.setDisplaySize(gameSize.width, gameSize.height);
      this.scoreText.setPosition(10, 10);
      this.timerText.setPosition(gameSize.width - 100, 10);
    });

    this.scoreText = this.add.text(10, 10, "Очки: 0", {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "'Tiny5', serif",
    });
    this.timerText = this.add.text(
      this.scale.width - 150,
      10,
      `Час: ${this.timeLeft}`,
      { fontSize: "20px", color: "#ffffff", fontFamily: "'Tiny5', serif" }
    );

    // ✅ Додаємо персонажа

    console.log("🛠️ this.physics перевірка:", this.physics);
    if (!this.physics) {
      console.error("❌ this.physics не ініціалізований!");
      return;
    }

    this.catcher = this.physics.add.sprite(400, 500, "catcher");
    this.catcher.setCollideWorldBounds(true);
    this.catcher.setBounce(0.2);
    this.catcher.setGravityY(500);

    // ✅ Гарантовано ініціалізуємо `cursors`
    const inputKeys = this.input.keyboard?.createCursorKeys();
    if (inputKeys) {
      this.cursors = inputKeys;
    } else {
      console.warn("⚠️ Клавіатурне керування не ініціалізовано.");
    }

    this.butterflies = this.physics.add.group();

    this.spawnButterflies(5); // Початкові 5 метеликів

    this.time.addEvent({
      delay: 3000,
      callback: () => this.spawnButterflies(1),
      callbackScope: this,
      loop: true,
    });

    // ✅ Запускаємо таймер
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.platforms = this.physics.add.staticGroup(); // 🛠 Ініціалізація перед використанням
    // Функція перевірки, чи перетинається нова платформа з існуючими
    const isOverlapping = (x: number, y: number, minDistance: number = 60) => {
      return this.platforms.getChildren().some((platform) => {
        const plat = platform as Phaser.Physics.Arcade.Sprite;
        const distance = Phaser.Math.Distance.Between(x, y, plat.x, plat.y);
        return distance < minDistance;
      });
    };

    // Функція для генерації платформ без накладання
    const generatePlatforms = (
      count: number,
      minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      minScale: number,
      maxScale: number
    ) => {
      for (let i = 0; i < count; i++) {
        let x, y;
        let attempts = 10; // Кількість спроб знайти вільне місце

        do {
          x = Phaser.Math.Between(minX, maxX);
          y = Phaser.Math.Between(minY, maxY);
          attempts--;
        } while (isOverlapping(x, y, 70) && attempts > 0); // Перевіряємо накладання

        if (attempts > 0) {
          const scaleX = Phaser.Math.FloatBetween(minScale, maxScale);
          this.platforms
            .create(x, y, "platform")
            .setScale(scaleX, 0.5)
            .refreshBody();
        }
      }
    };

    generatePlatforms(3, 100, this.scale.width - 100, 100, 250, 0.8, 1.2); // 🔹 Верхній рівень (менші платформи)
    generatePlatforms(3, 100, this.scale.width - 100, 270, 400, 1.0, 1.4); // 🔹 Середній рівень (вище, менше блокування)
    generatePlatforms(
      3,
      100,
      this.scale.width - 100,
      this.scale.height - 130,
      this.scale.height - 60,
      1.2,
      1.5
    ); // 🔹 Нижній рівень (зручні для стрибків)

    // ✅ Додаємо фізику, щоб персонаж міг стояти на платформах
    this.physics.add.collider(this.catcher, this.platforms);

    //додаємо трампліни
    this.time.addEvent({
      delay: Phaser.Math.Between(7000, 10000), // Випадково раз на 7-10 секунд
      callback: this.spawnTemporaryTrampolines,
      callbackScope: this,
      loop: true,
    });

    if (!this.anims.exists("flyBat")) {
      this.anims.create({
        key: "flyBat",
        frames: this.anims.generateFrameNumbers("bat", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // 🎞️ Анімація летючої миші
    this.anims.create({
      key: "flyBat",
      frames: this.anims.generateFrameNumbers("bat", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    // 🦇 Додаємо мишей тільки у складному рівні
    if (this.difficulty === "hard") {
      if (!this.bats) {
        this.bats = this.physics.add.group(); // 🛠 Створюємо групу
      } else {
        this.bats.clear(true, true); // ✅ Видаляємо мишей перед новою грою
      }

      this.spawnBats(2); // Спавнимо 2 мишей

      this.time.addEvent({
        delay: 5000,
        callback: () => this.spawnBats(1),
        callbackScope: this,
        loop: true,
      });
    }
  }

  // 🦇 Спавн мишей
  spawnBats(count: number) {
    if (!this.bats) {
      return; // ❌ Уникаємо помилки, якщо bats ще немає
    }

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, this.scale.width - 100);
      const y = Phaser.Math.Between(50, 300);

      const bat = this.physics.add.sprite(x, y, "bat").play("flyBat");
      bat.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-50, 50)
      );
      bat.setCollideWorldBounds(true);
      bat.setBounce(1);

      this.bats.add(bat); // ✅ Додаємо в групу

      this.physics.add.overlap(this.catcher, bat, () => {
        console.log("💀 Гравця зловила миша!");
        this.scene.start("GameOverScene", { score: this.score });
      });
    }
  }

  spawnTemporaryTrampolines() {
    const platformsArray =
      this.platforms.getChildren() as Phaser.Physics.Arcade.Sprite[]; // 🎯 Додаємо типізацію
    if (platformsArray.length === 0) return; // Якщо платформ немає, нічого не робимо

    const trampolineCount = Phaser.Math.Between(1, 2); // Випадково 1-2 трампліни

    for (let i = 0; i < trampolineCount; i++) {
      const randomPlatform = Phaser.Math.RND.pick(platformsArray); // Випадкова платформа

      if (!randomPlatform.body) continue; // Перевіряємо, чи є фізика у платформи

      const platformX = randomPlatform.x;
      const platformY = randomPlatform.y - 20; // Трамплін трохи вище платформи

      const trampoline = this.physics.add
        .sprite(platformX, platformY, "platform")
        .setScale(0.5, 0.2)
        .refreshBody();

      // Додаємо ефект підвищеного стрибка
      this.physics.add.overlap(this.catcher, trampoline, () => {
        this.catcher.setVelocityY(-450); // 🔹 Сильніший стрибок
      });

      // Видалення трампліну через 3 секунди
      this.time.delayedCall(3000, () => {
        trampoline.destroy();
      });
    }
  }

  private maxButterflies = 10; // 🦋 Ліміт метеликів на екрані
  private butterflies!: Phaser.Physics.Arcade.Group; // Група метеликів

  spawnButterflies(count: number) {
    if (!this.butterflies) {
      this.butterflies = this.physics.add.group(); // Створюємо групу при першому виклику
    }

    // Видаляємо зайвих метеликів, якщо їх більше ліміту
    while (this.butterflies.getChildren().length >= this.maxButterflies) {
      this.butterflies.getChildren()[0].destroy();
    }

    for (let i = 0; i < count; i++) {
      if (this.butterflies.getChildren().length >= this.maxButterflies) {
        break;
      }

      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(200, 500);
      const isBlue = Phaser.Math.Between(1, 10) === 1; // 10% шанс на синього метелика

      const butterfly = this.physics.add.sprite(
        x,
        y,
        isBlue ? "blueButterfly" : "butterfly"
      );
      butterfly.setScale(2);
      butterfly.play(isBlue ? "flyBlue" : "fly");

      butterfly.setGravityY(0);
      butterfly.setCollideWorldBounds(true);
      butterfly.setData("isBlue", isBlue); // 🔹 Зберігаємо, який це метелик
      this.butterflies.add(butterfly);

      // Анімація польоту
      this.tweens.add({
        targets: butterfly,
        x: x + Phaser.Math.Between(-100, 100), // Коливається по горизонталі
        y: y - Phaser.Math.Between(20, 100), // Літає ближче до землі
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Взаємодія з персонажем
      this.physics.add.overlap(
        this.catcher, // Персонаж
        this.butterflies, // Група метеликів
        (catcher, caughtButterfly) => {
          if (caughtButterfly instanceof Phaser.Physics.Arcade.Sprite) {
            this.catchButterfly(caughtButterfly);
          }
        },
        undefined,
        this
      );
    }
  }

  catchButterfly(butterfly: Phaser.Physics.Arcade.Sprite) {
    const isBlue = butterfly.getData("isBlue"); // Отримуємо значення
    butterfly.destroy();
    this.score += isBlue ? 50 : 10; // 🎯 50 очок за синього, 10 за звичайного
    this.scoreText.setText("Очки: " + this.score);
    this.spawnButterflies(1);
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Час: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.scene.start("GameOverScene", { score: this.score });
    }
  }

  update() {
    if (!this.cursors) {
      return; // ✅ Якщо немає керування, не виконуємо код
    }

    if (this.cursors.left?.isDown) {
      this.catcher.setVelocityX(-200); // Рух вліво
    } else if (this.cursors.right?.isDown) {
      this.catcher.setVelocityX(200); // Рух вправо
    } else {
      this.catcher.setVelocityX(0); // Зупинка
    }

    if (this.cursors.up?.isDown && this.catcher.body?.blocked.down) {
      this.catcher.setVelocityY(-400); // Стрибок вгору
    }
  }
}
