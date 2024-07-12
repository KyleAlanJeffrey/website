import * as PIXI from "pixi.js";
import { Assets, Text } from "pixi.js";

const PADDING = 25;
const FrogMovement = { blocked: false };

function checkOverlap(p1: PIXI.Bounds, p2: PIXI.Bounds) {
  const l1 = { x: p1.x, y: p1.y };
  const r1 = { x: p1.x + p1.width, y: p1.y + p1.height };
  const l2 = { x: p2.x, y: p2.y };
  const r2 = { x: p2.x + p2.width, y: p2.y + p2.height };
  // if rectangle has area 0, no overlap
  console.log(l1, r1, l2, r2);
  if (l1.x == r1.x || l1.y == r1.y || r2.x == l2.x || l2.y == r2.y) {
    console.log("No overlap");
    return false;
  }
  // If one rectangle is on left side of other
  if (l1.x > r2.x || l2.x > r1.x) {
    console.log("outside x");
    return false;
  }

  // If one rectangle is above other
  if (r1.y < l2.y || r2.y < l1.y) {
    {
      console.log("outside y");
      return false;
    }
  }

  return true;
}

function pad(obj: PIXI.Text) {
  obj.x += PADDING;
  obj.y += PADDING;
}
async function main() {
  const app = new PIXI.Application();
  await app.init({
    resizeTo: window,
    backgroundColor: "#333",
  });

  if (document.querySelector("#game-canvas")) {
    document.querySelector("#game-canvas")?.appendChild(app.canvas);
  }
  const [appWidth, appHeight] = [app.canvas.width, app.canvas.height];

  // load the fonts
  await Assets.load("./src/assets/Nintendoid.ttf");
  const spriteAsset = await Assets.load(
    "https://img.itch.zone/aW1hZ2UvMjI0NzExMS8xMzMxNTQyMC5wbmc=/347x500/rRN13J.png"
  );
  const frog = new PIXI.Sprite(spriteAsset);
  frog.x = appWidth / 2;
  frog.y = appHeight / 2;
  frog.anchor.set(0.5);
  frog.scale.set(0.5);
  app.stage.addChild(frog);

  const objects: PIXI.Text[] = [];
  objects.push(
    ...[
      new Text({
        text: "kyle jeffrey",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "48",
          fill: "white",
        },
      }),
      new Text({
        text: "Robotics Engineer / Web Developer",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "18",
          fill: "#ffff3f",
        },
        y: 55,
      }),
      new Text({
        text: ">---------------------------------------------------",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "13",
          fill: "#ffffff",
        },
        y: 85,
      }),
      new Text({
        text: "Socials: ",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "18",
          fill: "#ffffff",
        },
        y: 105,
      }),
      new Text({
        text: "Linkedin",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "18",
          fill: "#00afff",
          fontStyle: "italic",
        },
        y: 105,
        x: 150,
      }),
      new Text({
        text: "Github",
        style: {
          fontFamily: "Nintendoid",
          fontSize: "18",
          fill: "#00af00",
          fontStyle: "italic",
        },
        interactive: true,
        cursor: "pointer",
        onpointerdown: () => {
          open("https://github.com/KyleAlanJeffrey");
        },
        y: 105,
        x: 310,
      }),
    ]
  );

  // Pad all objects
  // Add all objects to the stage
  for (const obj of objects) {
    console.log(obj);
    pad(obj);
    console.log(obj);
    app.stage.addChild(obj);
  }

  // Add KeyListener
  // Listen for keydown events
  const keys: { [key: string]: boolean } = {};
  window.addEventListener("keydown", keysDown);
  window.addEventListener("keyup", keysUp);
  function keysDown(e: KeyboardEvent) {
    keys[e.key] = true;
  }
  function keysUp(e: KeyboardEvent) {
    keys[e.key] = false;
  }

  // Add game loop
  const shift = { x: 5 };
  app.ticker.add(() => {
    if (keys["ArrowLeft"]) {
      frog.x -= shift.x;
      if (FrogMovement.blocked) {
        frog.x += shift.x * 4;
      }
    }
    if (keys["ArrowRight"]) {
      frog.x += shift.x;
      if (FrogMovement.blocked) {
        frog.x -= shift.x * 4;
      }
    }
    if (keys["ArrowUp"]) {
      frog.y -= shift.x;
      if (FrogMovement.blocked) {
        frog.y += shift.x * 4;
      }
    }
    if (keys["ArrowDown"]) {
      frog.y += shift.x;
      if (FrogMovement.blocked) {
        frog.y -= shift.x * 4;
      }
    }
  });

  // Add collision detection
  app.ticker.add(
    () => {
      let blocked = false;
      for (const obj of objects) {
        if (checkOverlap(frog.getBounds(), obj.getBounds())) {
          console.log("Collision detected");
          obj.style.fill = "red";
          blocked = true;
        } else {
          // obj.style.fill = "white";
        }
      }
      if (FrogMovement.blocked && !blocked) {
        FrogMovement.blocked = false;
      }
      FrogMovement.blocked = blocked;
    },
    undefined,
    PIXI.UPDATE_PRIORITY.NORMAL
  );
}

main();
