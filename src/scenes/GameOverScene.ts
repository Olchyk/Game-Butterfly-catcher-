import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  private score!: number;

  constructor() {
    super("GameOverScene");
  }

  init(data: any) {
    this.score = data.score;
  }
  preload() {
    this.load.image("gameOverBackground", "assets/background/gameover.jpg");
  }

  create() {
    const { width, height } = this.scale;

    const background = this.add.image(
      width / 2,
      height / 2,
      "gameOverBackground"
    );
    background.setDisplaySize(width, height);
    const difficulty = this.registry.get("difficulty") || "unknown"; // ✅ Отримуємо рівень складності

    // Зберігаємо історію очок
    const scoreHistory = JSON.parse(
      localStorage.getItem("scoreHistory") || "[]"
    );
    scoreHistory.push({ difficulty, score: this.score });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

    this.add
      .text(width / 2, height * 0.3, "Гру завершено!", {
        fontSize: "32px",
        fontFamily: "'Tiny5', sans-serif",
        color: "#4A372D",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.4, `Твій рахунок: ${this.score}`, {
        fontSize: "24px",
        fontFamily: "'Tiny5', sans-serif",
        color: "#A29088",
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(width / 2, height * 0.5, "🔄 Грати ще раз", {
        fontSize: "24px",
        fontFamily: "'Tiny5', sans-serif",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("GameScene", { difficulty });
    });

    const menuButton = this.add
      .text(width / 2, height * 0.6, "🏠 Головне меню", {
        fontSize: "24px",
        fontFamily: "'Tiny5', sans-serif",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setInteractive();

    menuButton.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });

    // 📜 Кнопка "Переглянути історію"
    const historyButton = this.add
      .text(width / 2, height / 2 + 120, "📜 Історія очок", {
        fontSize: "20px",
        color: "#4A372D",
        fontFamily: "'Tiny5', serif",
      })
      .setOrigin(0.5)
      .setInteractive();

    historyButton.on("pointerdown", () => {
      this.scene.start("ScoreHistoryScene");
    });
  }
}

// import Phaser from "phaser";

// export default class GameOverScene extends Phaser.Scene {
//   private score!: number;
//   private difficulty!: string;

//   constructor() {
//     super("GameOverScene");
//   }

//   init(data: any) {
//     this.score = data.score || 0;
//     this.difficulty = data.difficulty || "unknown"; // Отримуємо рівень складності

//     // 📌 Отримуємо попередні результати
//     const savedScores = localStorage.getItem("scoreHistory");
//     let scoreHistory: { difficulty: string; score: number }[] = savedScores
//       ? JSON.parse(savedScores)
//       : [];

//     // 📌 Додаємо новий результат
//     scoreHistory.push({ difficulty: this.difficulty, score: this.score });

//     // 📌 Зберігаємо оновлений список
//     localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
//   }

//   preload() {
//     this.load.image("gameOverBackground", "assets/background/gameover.jpg");
//   }

//   create() {
//     const { width, height } = this.scale;

//     const background = this.add.image(
//       width / 2,
//       height / 2,
//       "gameOverBackground"
//     );
//     background.setDisplaySize(width, height);

//     this.add
//       .text(width / 2, height / 2 - 100, "Гру завершено!", {
//         fontSize: "32px",
//         color: "#4A372D",
//         fontFamily: "'Tiny5', serif",
//       })
//       .setOrigin(0.5);

//     this.add
//       .text(width / 2, height / 2 - 50, `Твій рахунок: ${this.score}`, {
//         fontSize: "24px",
//         color: "#A29088",
//         fontFamily: "'Tiny5', serif",
//       })
//       .setOrigin(0.5);

//     // 🔄 Кнопка "Грати ще раз"
//     const restartButton = this.add
//       .text(width / 2, height / 2 + 20, "🔄 Грати ще раз", {
//         fontSize: "24px",
//         color: "#00ff00",
//         fontFamily: "'Tiny5', serif",
//       })
//       .setOrigin(0.5)
//       .setInteractive();

//     restartButton.on("pointerdown", () => {
//       this.scene.start("GameScene");
//     });

//     // 🏠 Кнопка "Головне меню"
//     const menuButton = this.add
//       .text(width / 2, height / 2 + 70, "🏠 Головне меню", {
//         fontSize: "24px",
//         color: "#ff0000",
//         fontFamily: "'Tiny5', serif",
//       })
//       .setOrigin(0.5)
//       .setInteractive();

//     menuButton.on("pointerdown", () => {
//       this.scene.start("MainMenuScene");
//     });

//     // 📜 Кнопка "Переглянути історію"
//     const historyButton = this.add
//       .text(width / 2, height / 2 + 120, "📜 Історія очок", {
//         fontSize: "20px",
//         color: "#4A372D",
//         fontFamily: "'Tiny5', serif",
//       })
//       .setOrigin(0.5)
//       .setInteractive();

//     historyButton.on("pointerdown", () => {
//       this.scene.start("ScoreHistoryScene");
//     });
//   }
// }
