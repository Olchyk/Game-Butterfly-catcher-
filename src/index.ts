import Phaser from "phaser";
import MainMenuScene from "./scenes/MainMenuScene";
import SelectDifScene from "./scenes/SelectDifScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import ScoreHistoryScene from "./scenes/ScoreHistoryScene";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE, // Автоматично змінює розмір гри
    autoCenter: Phaser.Scale.CENTER_BOTH, // Центрує гру
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 500 },
      debug: false,
    },
  },
  scene: [
    MainMenuScene,
    SelectDifScene,
    GameScene,
    GameOverScene,
    ScoreHistoryScene,
  ],
};

const game = new Phaser.Game(config);

// ✅ Додаємо реакцію на зміну розміру екрану
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
