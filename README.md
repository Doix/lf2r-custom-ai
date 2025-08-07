# LF2R AI Modding Kit

This project is a loader and framework for creating custom AI for enemies in the game LF2 Remastered (lf2r) without altering the original game source code.

## How It Works

The system is built on three core JavaScript concepts:

1.  **Monkey Patching**: The script intercepts the game's core AI function calls (`TI2f` and `Cr0f`) at runtime. When the game tries to execute its own AI, our script gets to run first. These functions will probably get different names every update.

2.  **Dynamic AI Loading**: When an entity is loaded, the script attempts to `fetch` a corresponding custom AI file from the `_res_ai/` directory (e.g., `_res_ai/4.js` for entity ID 4). If a custom AI file is found, it's loaded; otherwise, the original game AI is executed.

3.  **Proxy Translation Layer**:
Uses some jank to map the game's internal, minified variable names to human-readable ones. Luckily, the mangled names are consistent across all objects in the game, so we use the same proxy constructor. Is there a better way to do this? Maybe. But this works for now.

## Installation

To install and use this modding framework, follow these steps:

**Modify the Game's HTML**

Open `electron_index.html` in a text editor.

**Add the Script Tag**

At the very bottom of electron_index.html, just add a new line with`<script src="load_ai.js"></script>`

**Run the game**

Custom AI should be loading now.

## Creating Custom AI

To create a custom AI for an entity:

1.  Find the entity's ID (e.g., `4` for Henry).
2.  Create a new JavaScript file in the `_res_ai/` directory named `<id>.js` (e.g., `_res_ai/4.js`).
3.  Inside that file, define an `ego()` or `id()` function. These correspond to the game's original `Cr0f` and `TI2f` functions, respectively.

    ```javascript
    // File: _res_ai/4.js
    // Custom AI for henry

    function ego(game, targetNum, objectNum, t, h, o, a, n, r, i) {
      const self = game.objects[objectNum];
      self.up = 1;
      return true;
    };
    ```
