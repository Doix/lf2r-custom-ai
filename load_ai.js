const DEBUG_AI = 1;
const loadDataIdentifier = "r0";

const nameMap = {
  A: "attack",
  D: "b1",
  DJA: "H1",
  DdA: "J1",
  DdJ: "Z1",
  DlA: "O1",
  DlJ: "G1",
  DrA: "Q1",
  DrJ: "R1",
  DuA: "W1",
  DuJ: "P1",
  J: "Mt",
  aaction: "jh",
  act: "ji",
  action: "action",
  arest: "Ah",
  attacking: "ca",
  backgrounds: "Jt",
  backhurtact: "oa",
  bdefend: "xh",
  bdefend_counter: "Md",
  bdy_count: "Xa",
  bdys: "Ca",
  blink: "bi",
  centerx: "Da",
  centery: "Va",
  clone: "parent",
  cover: "Qh",
  ctimer: "Dd",
  current_background: "Pt",
  daction: "qh",
  dark_hp: "pi",
  dash_distance: "io",
  dash_distancez: "eo",
  dash_height: "qa",
  data: "t0",
  decrease: "na",
  default_centerx: "ua",
  default_centery: "fa",
  difficulty: "Ht",
  dircontrol: "ra",
  down: "Y0",
  dvx: "Th",
  dvy: "Ch",
  dvz: "da",
  effect: "effect",
  elapsed_time: "zi",
  exists: "ri",
  facing: "t1",
  fall: "Xh",
  frame: "Oc",
  frame1: "Oc",
  frames: "f",
  fronthurtact: "aa",
  gameInstance: "_",
  h: "_h",
  heal: "Rd",
  heavy_running_speed: "Qa",
  heavy_running_speedz: "Oa",
  heavy_walking_speed: "Ja",
  heavy_walking_speedz: "Ha",
  hit_Da: "ba",
  hit_Dj: "wa",
  hit_Fa: "Oi",
  hit_Fj: "Fa",
  hit_Ua: "Sa",
  hit_Uj: "Ea",
  hit_a: "pa",
  hit_d: "ma",
  hit_j: "j1",
  hit_ja: "ya",
  holding_a: "ui",
  holding_d: "S1",
  holding_down: "f1",
  holding_j: "m1",
  holding_left: "g1",
  holding_right: "_1",
  holding_up: "u1",
  hp: "mi",
  hurtable: "sa",
  injury: "Nh",
  itr_count: "Ta",
  itrs: "Ia",
  jaction: "Kh",
  join: "join",
  jump_distance: "Ka",
  jump_distancez: "$a",
  jump_height: "ja",
  kind: "kind",
  left: "left",
  max_hp: "_i",
  mode: "c1",
  mp: "gi",
  next: "next",
  num: "index",
  objects: "di",
  oid: "Hh",
  pic: "ga",
  pickedact: "Jh",
  pickingact: "Ph",
  rand: "xt",
  ratio: "ratio",
  reserve: "Xn",
  resized: "vt",
  respond: "Uh",
  right: "right",
  rowing_distance: "ho",
  rowing_height: "so",
  running_frame_rate: "Za",
  running_speed: "Wa",
  running_speedz: "Pa",
  source_id: "Hc",
  stage_bound: "Ze",
  stage_clear: "d1",
  state: "state",
  taction: "$h",
  team: "group",
  times: "Cn",
  up: "Vt",
  upscale: "Qo",
  vaction: "Oh",
  vrest: "Yh",
  w: "w",
  wait: "wait",
  walking_frame_rate: "za",
  walking_speed: "Ra",
  walking_speedz: "Ga",
  weapon_drop_hurt: "oo",
  weapon_held: "U1",
  weapon_hp: "ao",
  weapon_type: "X1",
  weaponact: "la",
  when_clear_goto_phase: "Tn",
  width: "w",
  x: "x",
  x_velocity: "wi",
  y: "y",
  y_velocity: "Di",
  z_velocity: "yi",
  zwidth: "zh",
  zwidth1: "Ei",
  zwidth2: "Fi"
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
        } else if (prop === "bdefend") {
          if (obj) {
            const obj_bdefend = obj[nameMap['bdefend']];
            const obj_bdefend_counter = obj[nameMap['bdefend_counter']];
            const bdefendValue = obj_bdefend !== undefined ? obj_bdefend : obj_bdefend_counter;
            return bdefendValue;
          }
        }

        const mangledProp = mapping[prop] || prop;
        const value = Reflect.get(obj, mangledProp, receiver);

        if (DEBUG_AI && value === undefined) {
          if (typeof prop !== 'symbol' && prop !== 'then') {
            console.warn(`[AI Proxy] Property '${String(prop)}' not found on object.`);
          }
        }

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

async function preprocessIncludes(code, basePath = './_res_ai/') {
    const includeRegex = /include\s*\(\s*"([^"]+)"\s*\);?/gm;
    const includes = [];
    let match;

    while ((match = includeRegex.exec(code)) !== null) {
        includes.push({
            directive: match[0],
            fileName: match[1]
        });
    }

    if (includes.length === 0) {
        return code;
    }

    let processedCode = code;

    for (const include of includes) {
        const filePath = basePath + include.fileName;
        try {
            const resp = await fetch(filePath, { cache: "no-store" });
            if (resp.ok) {
                let includedCode = await resp.text();
                const recursivelyProcessed = await preprocessIncludes(includedCode, basePath);
                processedCode = processedCode.replace(include.directive, recursivelyProcessed);
            } else {
                console.warn(`[AI Include] Failed to fetch ${filePath}`);
                processedCode = processedCode.replace(include.directive, '');
            }
        } catch (error) {
            console.error(`[AI Include] Error fetching ${filePath}:`, error);
            processedCode = processedCode.replace(include.directive, '');
        }
    }

    return processedCode;
}

async function loadCustomAI(id) {
  if (!DEBUG_AI && customAIs[id] !== undefined) return;

  try {
    const resp = await fetch(`./_res_ai/${id}.js`, {
      cache: "no-store",
    });
    if (!resp.ok) {
      customAIs[id] = null;
      return;
    }

    let code = await resp.text();
    code = await preprocessIncludes(code);
    
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

    const factoryBody = `
            const clr = console.clear;
            let target = initialTarget;
            let bg_zwidth1, bg_zwidth2, bg_width, difficulty, stage_clear, game, mode, stage_bound, elapsed_time;

            const updateGlobals = () => {

                const backgrounds = nameMap.backgrounds;
                const zwidth1 = nameMap.zwdith1;
                const zwidth2 = nameMap.zwdith2;

                const current_background = gameInstance.current_background;
                bg_zwidth1 = T7ES[backgrounds][current_background][zwidth1];
                bg_zwidth2 = T7ES[backgrounds][current_background][zwidth2];
                bg_width = T7ES[backgrounds][current_background].w;
                difficulty = gameInstance.difficulty;
                stage_clear = gameInstance.stage_clear;
                game = gameInstance;
                mode = gameInstance.mode;
                stage_bound = mode == 4 ? gameInstance.stage_bound : bg_width;
                elapsed_time = gameInstance.elapsed_time;
            };
            
            updateGlobals();

            const gameInstanceProp = nameMap.gameInstance;
            const randProp = nameMap.rand;

            const rand = (i) => FouV[gameInstanceProp][randProp](0, i);

            const loadTarget = (index) => {
                target = gameInstance.objects[index];
                return gameInstance.exists[index] ? gameInstance.objects[index].data.type : -1;
            };

            const setTarget = (newTarget) => {
                target = newTarget;
            };

            ${transformedCode}
            
            return { setTarget, updateGlobals, ${definedFunctions.join(", ")} };
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

const originalLoadFile = TIJj.prototype[loadDataIdentifier];
TIJj.prototype[loadDataIdentifier] = async function (...args) {
  await loadCustomAI(this.id);
  return await originalLoadFile.apply(this, args);
};

const originalIdAi = TI2f;
const originalEgoAi = Cr0f;

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
    aiInstance.updateGlobals();
  }

  const aiFunction = aiInstance[functionName];

  if (typeof aiFunction === "function") {
    const newArgs = [gameInstance, ...Array.from(originalArgs).slice(1)];
    return aiFunction.apply(null, newArgs);
  }
}

TI2f = function (t, i) {
  const proxiedGameInstance = getProxiedObject(t, nameMap);

  const id = proxiedGameInstance.objects[i].data.id;
  const source_id = proxiedGameInstance.objects[i].source_id;

  const attempts = [
    { key: source_id, name: 'source_id' },
    { key: id, name: 'id' }
  ];

  let selfEntity = null;

  for (const attempt of attempts) {
    const aiInfo = customAIs[attempt.key];

    if (aiInfo && aiInfo.definedFunctions.includes(attempt.name)) {
      try {
        selfEntity = proxiedGameInstance.objects[i];

        if (!selfEntity) {
          break;
        }

        const result = runAIFunction(
          aiInfo,
          attempt.name,
          proxiedGameInstance,
          selfEntity,
          undefined,
          arguments
        );
        
        if (result !== -1) {
          return result;
        }
      } catch (error) {
        console.error(`Error in custom AI (${attempt.name}) for entity ${attempt.key}:`, error);
        return;
      }
    }
  }

  return originalIdAi.apply(this, arguments);
};

Cr0f = function (game, targetNum, objectNum, t, h, o, a, n, r, i) {
  const proxiedGameInstance = getProxiedObject(game, nameMap);
  const entityId = proxiedGameInstance.objects[objectNum].data.id;
  const aiInfo = customAIs[entityId];

  if (aiInfo && aiInfo.definedFunctions.includes("ego")) {
    try {
      const selfEntity = proxiedGameInstance.objects[objectNum];
      const targetEntity = proxiedGameInstance.objects[targetNum];

      if (!selfEntity) {
        return originalEgoAi.apply(this, arguments);
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

  return originalEgoAi.apply(this, arguments);
};
