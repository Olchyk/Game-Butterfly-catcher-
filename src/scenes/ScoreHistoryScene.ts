import Phaser from "phaser";

export default class ScoreHistoryScene extends Phaser.Scene {
  constructor() {
    super("ScoreHistoryScene");
  }

  preload() {
    this.load.image("historyBackground", "assets/background/history.jpg"); // 🎨 Додаємо фон
  }

  create() {
    const { width, height } = this.scale;

    // 📌 Додаємо фон
    const background = this.add.image(
      width / 2,
      height / 2,
      "historyBackground"
    );
    background.setDisplaySize(width, height);

    let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

    if (scoreHistory.length === 0) {
      this.add
        .text(width / 2, height / 2 - 50, "Ще не було зіграно жодної гри", {
          fontSize: "24px",
          fontFamily: "'Tiny5', sans-serif",
          color: "#ffffff",
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(width / 2, 100, "Історія очок:", {
          fontSize: "28px",
          fontFamily: "'Tiny5', sans-serif",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      scoreHistory
        .slice(-5)
        .reverse()
        .forEach((entry: any, index: number) => {
          const difficultyName = entry.difficulty || "Невідомий рівень";
          this.add
            .text(
              width / 2,
              150 + index * 40,
              `${difficultyName}: ${entry.score} очок`,
              {
                fontSize: "22px",
                fontFamily: "'Tiny5', sans-serif",
                color: "#ffffff",
              }
            )
            .setOrigin(0.5);
        });
    }

    // 🔙 Кнопка повернення до головного меню
    const backButton = this.add
      .text(width / 2, height - 100, "↩️ Назад до меню", {
        fontSize: "24px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setInteractive();

    backButton.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });

    // 🗑 Кнопка очищення історії
    const clearButton = this.add
      .text(width / 2, height - 150, "🗑 Очистити історію", {
        fontSize: "24px",
        fontFamily: "'Tiny5', serif",
        color: "##ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    clearButton.on("pointerdown", () => {
      localStorage.removeItem("scoreHistory");
      this.scene.restart(); // Перезапускаємо сцену, щоб оновити вигляд
    });
  }
}
