const nameMap = {
  objects: "qt",
  data: "q",
  exists: "Pt",

  up: "dt",
  down: "A0",
  J: "ft",
  D: "o1",
  A: "attack",
  holding_up: "qi",
  holding_down: "t1",
  holding_left: "i1",
  holding_right: "e1",
  holding_a: "ti",
  holding_j: "s1",
  holding_d: "h1",

  DrJ: "B1",
  Dlj: "M1",
  DuJ: "T1",
  DdJ: "L1",
  DrA: "v1",
  DlA: "A1",
  DuA: "I1",
  DdA: "X1",
  DJA: "C1",

  frame: "Cc",
  team: "group",

  aaction: "Yh",
  act: "Ni",
  action: "action",
  arest: "Fh",
  attacking: "Ph",
  backhurtact: "Hh",
  bdefend: "yh",
  centerx: "do",
  centery: "uo",
  cover: "Ch",
  daction: "xh",
  dash_distance: "Ro",
  dash_distancez: "Wo",
  dash_height: "Zo",
  decrease: "Qh",
  default_centerx: "$h",
  default_centery: "qh",
  dircontrol: "Oh",
  dvx: "mh",
  dvy: "Sh",
  dvz: "Kh",
  effect: "effect",
  facing: "Ri",
  fall: "bh",
  fronthurtact: "Jh",
  h: "ih",
  heavy_running_speed: "Yo",
  heavy_running_speedz: "Uo",
  heavy_walking_speed: "vo",
  heavy_walking_speedz: "Ao",
  hit_Da: "ao",
  hit_Dj: "lo",
  hit_Fa: "Ui",
  hit_Fj: "no",
  hit_Ua: "oo",
  hit_Uj: "ro",
  hit_a: "so",
  hit_d: "ho",
  hit_j: "Y1",
  hit_ja: "co",
  hp: "oi",
  hurtable: "Wh",
  injury: "Vh",
  jaction: "Uh",
  join: "join",
  jump_distance: "xo",
  jump_distancez: "zo",
  jump_height: "No",
  kind: "kind",
  mp: "ei",
  next: "next",
  oid: "Xh",
  pic: "io",
  pickedact: "Th",
  pickingact: "Ih",
  ratio: "ratio",
  reserve: "bn",
  resized: "wt",
  respond: "wh",
  rowing_distance: "Jo",
  rowing_height: "Go",
  running_frame_rate: "To",
  running_speed: "Xo",
  running_speedz: "Co",
  state: "state",
  taction: "Nh",
  times: "Sn",
  upscale: "va",
  vaction: "Ah",
  vrest: "Eh",
  w: "w",
  wait: "wait",
  walking_frame_rate: "Lo",
  walking_speed: "ko",
  walking_speedz: "Io",
  weapon_drop_hurt: "Qo",
  weapon_hp: "Ho",
  weaponact: "jh",
  when_clear_goto_phase: "mn",
  width: "w",
  x: "x",
  y: "y",
  zwidth: "Dh",

  x_velocity: "xi",
  y_velocity: "zi",
  z_velocity: "Zi",

  zwdith1: "li",
  zwdith2: "ri",
  num: "index",
  blink: "ni",

  ctimer: 'nd',
};

const getProxiedObject = (() => {
  const proxyCache = new WeakMap();

  function wrap(target, mapping) {
    if (target === null || typeof target !== "object") return target;
    if (proxyCache.has(target)) return proxyCache.get(target);

    const handler = {
      get(obj, prop, receiver) {
        if (prop === Symbol.iterator) {
          return (function* () {
            for (const value of obj) {
              yield wrap(value, mapping);
            }
          })();
        }
        const dataFileProp = mapping.data;
        const frameProp = mapping.frame;
        if (prop === "state") {
          if (
            obj &&
            obj[dataFileProp] &&
            obj[dataFileProp].f &&
            obj[frameProp] !== undefined &&
            obj[dataFileProp].f[obj[frameProp]]
          ) {
            const stateValue = obj[dataFileProp].f[obj[frameProp]].state;
            return wrap(stateValue, mapping);
          }
        } else if (prop === "id") {
          if (obj && obj[dataFileProp]) {
            const idValue = obj[dataFileProp].id;
            return wrap(idValue, mapping);
          }
        } else if (prop === "type") {
          if (obj && obj[dataFileProp]) {
            const typeValue = obj[dataFileProp].type;
            return wrap(typeValue, mapping);
          }
        }

        const mangledProp = mapping[prop] || prop;
        const value = Reflect.get(obj, mangledProp, receiver);
        return wrap(value, mapping);
      },
      set(obj, prop, value, receiver) {
        if (prop === "state") {
          return true;
        }
        const mangledProp = mapping[prop] || prop;
        return Reflect.set(obj, mangledProp, value, receiver);
      },
      has(obj, prop) {
        if (prop === "state") {
          return true;
        }
        const mangledProp = mapping[prop] || prop;
        return Reflect.has(obj, mangledProp);
      },
    };

    const proxy = new Proxy(target, handler);
    proxyCache.set(target, proxy);
    return proxy;
  }

  return wrap;
})();

const aiHelpers = {
  left(self, a = 1, b = 0) {
    self.left = a;
    self.holding_left = b;
  },
  right(self, a = 1, b = 0) {
    self.right = a;
    self.holding_right = b;
  },
  up(self, a = 1, b = 0) {
    self.up = a;
    self.holding_up = b;
  },
  down(self, a = 1, b = 0) {
    self.down = a;
    self.holding_down = b;
  },
  J(self, a = 1, b = 0) {
    self.J = a;
    self.holding_j = b;
  },
  D(self, a = 1, b = 0) {
    self.D = a;
    self.holding_d = b;
  },
  A(self, a = 1, b = 0) {
    self.A = a;
    self.holding_a = b;
  },
  DJA(self) {
    self.DJA = 3;
  },
  DrA(self) {
    self.DrA = 3;
  },
  DlA(self) {
    self.DlA = 3;
  },
  DuA(self) {
    self.DuA = 3;
  },
  DdA(self) {
    self.DdA = 3;
  },
  DrJ(self) {
    self.DrJ = 3;
  },
  DlJ(self) {
    self.DlJ = 3;
  },
  DuJ(self) {
    self.DuJ = 3;
  },
  DdJ(self) {
    self.DdJ = 3;
  },
  abs: Math.abs,
};

aiHelpers.resetInput = (self) => {
  aiHelpers.up(self, 0, 0);
  aiHelpers.down(self, 0, 0);
  aiHelpers.left(self, 0, 0);
  aiHelpers.right(self, 0, 0);
  aiHelpers.J(self, 0, 0);
  aiHelpers.D(self, 0, 0);
  aiHelpers.A(self, 0, 0);
};

function createAIExecutionContext(selfEntity) {
  const context = {};
  for (const key in aiHelpers) {
    const helper = aiHelpers[key];
    if (typeof helper !== "function") continue;

    if (key === "abs") {
      context[key] = helper;
    } else {
      context[key] = (...args) => helper(selfEntity, ...args);
    }
  }
  return context;
}

const customAIs = {};

async function loadCustomAI(id) {
  try {
    const resp = await fetch(`./_res_ai/${id}.js`, {
      cache: "no-store",
    });
    if (!resp.ok) {
      customAIs[id] = null;
      return;
    }

    let code = await resp.text();
    const definedFunctions = [];

    const transformedCode = code
      .replace(/function\s+([a-zA-Z0-9_]+)\s*\(/g, (match, name) => {
        if (!definedFunctions.includes(name)) definedFunctions.push(name);
        return `const ${name} = function(`;
      })
      .replace(/^([a-zA-Z0-9_]+)\s*=\s*function/gm, (match, name) => {
        if (!definedFunctions.includes(name)) definedFunctions.push(name);
        return `const ${name} = function`;
      });

    const contextKeys = Object.keys(aiHelpers);

    // blah refactor the whole namespacing shit and just pollute the global scope, for now do this
    const factoryBody = `
            let target = initialTarget;

            const q = gameInstance.Ct;
            const bg_zwidth1 = T7ES.vt[q].li;
            const bg_zwidth2 = T7ES.vt[q].ri;
            const bg_width = T7ES.vt[q].w;

            const loadTarget = (index) => {
                target = gameInstance.objects[index];
                return gameInstance.exists[index] ? gameInstance.objects[index].data.type : -1;
            };

            const setTarget = (newTarget) => {
                target = newTarget;
            };

            ${transformedCode}
            
            return { setTarget, ${definedFunctions.join(", ")} };
        `;

    const factory = new Function(
      "self",
      "initialTarget",
      "gameInstance",
      ...contextKeys,
      factoryBody
    );

    customAIs[id] = {
      factory: factory,
      definedFunctions: definedFunctions,
      executionCache: new WeakMap(),
    };
  } catch (error) {
    console.error(`Error compiling AI Sandbox for ID ${id}:`, error);
    customAIs[id] = null;
  }
}

const originalN0 = TIJj.prototype.n0;
TIJj.prototype.n0 = async function (...args) {
  await loadCustomAI(this.id);
  return await originalN0.apply(this, args);
};

const originalTI2f = TI2f;
const originalCr0f = Cr0f;

function runAIFunction(
  aiInfo,
  functionName,
  gameInstance,
  selfEntity,
  targetEntity,
  originalArgs
) {
  if (!aiInfo || typeof aiInfo.factory !== "function") return;

  let aiInstance = aiInfo.executionCache.get(selfEntity);

  if (!aiInstance) {
    const executionContext = createAIExecutionContext(selfEntity);
    const contextValues = Object.values(executionContext);

    aiInstance = aiInfo.factory.apply(null, [
      selfEntity,
      targetEntity,
      gameInstance,
      ...contextValues,
    ]);
    aiInfo.executionCache.set(selfEntity, aiInstance);
  } else {
    aiInstance.setTarget(targetEntity);
  }

  const aiFunction = aiInstance[functionName];

  if (typeof aiFunction === "function") {
    const newArgs = [gameInstance, ...Array.from(originalArgs).slice(1)];
    return aiFunction.apply(null, newArgs);
  }
}

TI2f = function (t, i) {
  const id = t.qt[i].q.id;
  const aiInfo = customAIs[id];

  if (aiInfo && aiInfo.definedFunctions.includes("id")) {
    try {
      const proxiedGameInstance = getProxiedObject(t, nameMap);
      const selfEntity = proxiedGameInstance.objects[i];
      const targetEntity = undefined;

      if (!selfEntity) {
        return originalTI2f.apply(this, arguments);
      }

      return runAIFunction(
        aiInfo,
        "id",
        proxiedGameInstance,
        selfEntity,
        targetEntity,
        arguments
      );
    } catch (error) {
      console.error(`Error in custom AI (id) for entity ${id}:`, error);
      return;
    }
  }

  return originalTI2f.apply(this, arguments);
};

Cr0f = function (game, targetNum, objectNum, t, h, o, a, n, r, i) {
  const entityId = game.qt[objectNum].q.id;
  const aiInfo = customAIs[entityId];

  if (aiInfo && aiInfo.definedFunctions.includes("ego")) {
    try {
      const proxiedGameInstance = getProxiedObject(game, nameMap);
      const selfEntity = proxiedGameInstance.objects[objectNum];
      const targetEntity = proxiedGameInstance.objects[targetNum];

      if (!selfEntity) {
        return originalCr0f.apply(this, arguments);
      }

      return runAIFunction(
        aiInfo,
        "ego",
        proxiedGameInstance,
        selfEntity,
        targetEntity,
        arguments
      );
    } catch (error) {
      console.error(`Error in custom AI (ego) for entity ${entityId}:`, error);
      return true;
    }
  }

  return originalCr0f.apply(this, arguments);
};
