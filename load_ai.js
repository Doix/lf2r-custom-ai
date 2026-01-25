const DEBUG_AI = 1;
const loadDataIdentifier = "d0";

const nameMap = {
  gameInstance: "g",
  A: "attack",
  D: "ah",
  DJA: "Ch",
  DdA: "Ih",
  DdJ: "Vh",
  DlA: "Xh",
  DlJ: "Dh",
  DrA: "Ah",
  DrJ: "wh",
  DuA: "Th",
  DuJ: "kh",
  J: "fe",
  aaction: "En",
  act: "xs",
  action: "action",
  arest: "on",
  attacking: "vn",
  backgrounds: "Ae",
  backhurtact: "kn",
  bdefend: "rn",
  bdefend_counter: "Au",
  bdy_count: "sr",
  bdys: "er",
  blink: "ds",
  centerx: "Hn",
  centery: "Qn",
  clone: "parent",
  cost: "Ho",
  cover: "Sn",
  ctimer: "ku",
  current_background: "Ce",
  current_stage: "da",
  daction: "Bn",
  dark_hp: "rs",
  dash_distance: "wr",
  dash_distancez: "Dr",
  dash_height: "yr",
  data: "s0",
  decrease: "In",
  default_centerx: "Yn",
  default_centery: "Nn",
  difficulty: "ve",
  dircontrol: "Cn",
  down: "R0",
  dvx: "en",
  dvy: "sn",
  dvz: "Xn",
  effect: "effect",
  exists: "Ke",
  facing: "Ws",
  fall: "hn",
  frame: "eu",
  frame1: "eu",
  frames: "f",
  fronthurtact: "Tn",
  h: "i1",
  heal: "Pu",
  heavy_running_speed: "Er",
  heavy_running_speedz: "Fr",
  heavy_walking_speed: "Sr",
  heavy_walking_speedz: "br",
  hit_Da: "zn",
  hit_Dj: "Pn",
  hit_Fa: "Rs",
  hit_Fj: "Wn",
  hit_Ua: "On",
  hit_Uj: "Zn",
  hit_a: "xn",
  hit_d: "Gn",
  hit_j: "Yh",
  hit_ja: "Jn",
  holding_a: "es",
  holding_d: "oh",
  holding_down: "ih",
  holding_j: "hh",
  holding_left: "eh",
  holding_right: "sh",
  holding_up: "th",
  hp: "ls",
  hurtable: "Dn",
  injury: "ln",
  itr_count: "ir",
  itrs: "tr",
  jaction: "Fn",
  join: "join",
  jump_distance: "Br",
  jump_distancez: "Mr",
  jump_height: "Lr",
  kind: "kind",
  left: "left",
  max_hp: "ns",
  mode: "$s",
  mp: "os",
  next: "next",
  num: "index",
  objects: "ts",
  oid: "pn",
  pic: "Un",
  pickedact: "mn",
  pickingact: "gn",
  rand: "ye",
  ratio: "ratio",
  reserve: "ll",
  resized: "ti",
  respond: "nn",
  right: "right",
  rowing_distance: "Tr",
  rowing_height: "Vr",
  running_frame_rate: "gr",
  running_speed: "mr",
  running_speedz: "pr",
  small_x_shift: "Fe",
  source_id: "tu",
  stage_bound: "Bo",
  stage_clear: "qs",
  state: "state",
  taction: "Ln",
  team: "group",
  times: "rl",
  up: "de",
  upscale: "F2",
  vaction: "bn",
  vrest: "an",
  w: "w",
  wait: "wait",
  walking_frame_rate: "dr",
  walking_speed: "_r",
  walking_speedz: "ur",
  weapon_drop_hurt: "Ir",
  weapon_held: "Mh",
  weapon_hp: "kr",
  weapon_type: "Eh",
  weaponact: "An",
  when_clear_goto_phase: "nl",
  width: "w",
  x: "x",
  x_velocity: "Gs",
  y: "y",
  y_velocity: "Os",
  z_velocity: "zs",
  zwidth: "cn",
  zwidth1: "us",
  zwidth2: "_s",
  elapsed_time: "As",
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
            let bg_zwidth1, bg_zwidth2, bg_width, difficulty, stage_clear, game, mode, stage_bound, elapsed_time, current_stage;

            const updateGlobals = () => {

                const backgrounds = nameMap.backgrounds;
                const zwidth1 = nameMap.zwidth1;
                const zwidth2 = nameMap.zwidth2;

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
                current_stage = gameInstance.current_stage;
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
