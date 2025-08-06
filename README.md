# LF2R AI Modding Kit

This project is a loader and framework for creating custom AI for entities in the game LF2 Remake (lf2r) without altering the original game source code. It allows developers to write complex AI logic using clean, readable JavaScript, which is translated on-the-fly to the game's internal, minified variable names.

## How It Works

The system is built on three core JavaScript concepts:

1.  **Monkey Patching**: The script intercepts the game's core AI function calls (`TI2f` and `Cr0f`) at runtime. When the game tries to execute its own AI, our script gets to run first. These functions will probably get different names every update.

2.  **Dynamic AI Loading**: When an entity is loaded, the script attempts to `fetch` a corresponding custom AI file from the `_res_ai/` directory (e.g., `_res_ai/4.js` for entity ID 4). If a custom AI file is found, it's loaded; otherwise, the original game AI is executed.

3.  **Proxy Translation Layer**:
    Uses some jank to map the game's internal, minified variable names to human-readable ones. Luckily, the mangled names are consistent across all objects in the game, so we use the same proxy. Is there a better way to do this? Maybe. But this works for now.

## Installation

To install and use this modding framework, follow these steps:

**Modify the Game's HTML**
Open `electron_index.html` in a text editor.

**Add the Script Tag**
`<script src="./load_ai.js"></script>`

## Creating Custom AI

To create a custom AI for an entity:

1.  Find the entity's ID (e.g., `4` for the Bandit).
2.  Create a new JavaScript file in the `_res_ai/` directory named `<id>.js` (e.g., `_res_ai/4.js`).
3.  Inside that file, define an `ego()` or `id()` function. These correspond to the game's original `Cr0f` and `TI2f` functions, respectively.

    ```javascript
    // File: _res_ai/4.js
    // Custom AI for hunter

    function ego(game, targetNum, objectNum, t, h, o, a, n, r, i) {
      // `game` is a proxied object. You can use clean names!
      const self = game.gameObjects[objectNum];

      // Set the 'up' input flag for this object
      self.up = 1;

      return true; // Return value may be used by the game
    };
    ```
