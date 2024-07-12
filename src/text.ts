import { Text } from "pixi.js";

class AnimatedFont {
  textObject: Text;
  textFrames: string[];
  speed: number;
  constructor(textFrames: string[], speed: number) {
    this.textObject = new Text({
      text: "Linkedin",
      style: {
        fontFamily: "Nintendoid",
        fontSize: "18",
        fill: "#00afff",
        fontStyle: "italic",
      },
      y: 105,
      x: 150,
    });
    this.textFrames = textFrames;
    this.speed = speed;
  }

  public animate() {
    let i = 0;
    setInterval(() => {
      this.textObject.text = this.textFrames[i];
      i = (i + 1) % this.textFrames.length;
    }, this.speed);
  }
}
