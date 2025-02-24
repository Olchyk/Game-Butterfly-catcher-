export default class SelectDifScene extends Phaser.Scene {
  constructor() {
    super("SelectDifScene");
  }

  preload() {
    // 🎨 Завантажуємо фони для кожного рівня складності
    this.load.image("backgroundEasy", "assets/background/morning-back.jpeg");
    this.load.image("backgroundMedium", "assets/background/day-back.jpeg");
    this.load.image("backgroundHard", "assets/background/dark-back.jpeg");
    this.load.image("backgroundmed", "assets/background/select-back.jpg"); // Фон для цієї сцени
  }

  create() {
    const { width, height } = this.scale;

    // 📌 Додаємо фон вибору рівня
    const background = this.add.image(width / 2, height / 2, "backgroundmed");
    background.setDisplaySize(width, height);

    // 📌 Заголовок (по центру)
    this.add
      .text(width / 2, height * 0.2, "Вибери рівень складності:", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "'Tiny5', serif",
      })
      .setOrigin(0.5);

    // 📌 Масив кнопок для уникнення дублювання коду
    const buttons = [
      {
        text: "😊 Легко",
        color: "#FFFFBF",
        fontFamily: "'Tiny5', serif",
        difficulty: "easy",
        bg: "backgroundEasy",
      },
      {
        text: "😎 Нормально",
        color: "#624933",
        fontFamily: "'Tiny5', serif",
        difficulty: "medium",
        bg: "backgroundMedium",
      },
      {
        text: "🔥 Складно",
        color: "#0F1916",
        fontFamily: "'Tiny5', serif",
        difficulty: "hard",
        bg: "backgroundHard",
      },
      { text: "↩️ Назад до меню", color: "#ffffff", difficulty: "menu" },
    ];

    buttons.forEach((btn, index) => {
      const button = this.add
        .text(width / 2, height * (0.35 + index * 0.1), btn.text, {
          fontSize: "24px",
          color: btn.color,
          fontFamily: "'Tiny5', serif",
        })
        .setOrigin(0.5)
        .setInteractive();

      button.on("pointerdown", () => {
        if (btn.difficulty === "menu") {
          this.scene.start("MainMenuScene");
        } else {
          console.log(`Обрано рівень: ${btn.difficulty}`);
          this.scene.stop("SelectDifScene");
          this.scene.start("GameScene", { difficulty: btn.difficulty });
        }
      });
    });
  }
}
