const nameMap = {
  gameObjects: "qt",
  datFile: "q",
  exists: "Pt",

  up: "dt",
  down: "A0",
  jump: "ft",
  defend: "o1",
  holdingUp: "e1",
  holdingDown: "ti",
  holdingLeft: "s1",
  holdingRight: "h1",
  holdingAttack: "S1",
  holdingJump: "m1",
  holdingDefend: "Lc",

  drj: "b1",
  dlj: "m1",
  duj: "t1",
  dvj: "l1",
  dra: "v1",
  dla: "a1",
  dua: "i1",
  dva: "x1",
  dja: "c1",

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
};

const getProxiedObject = (() => {
  const proxyCache = new WeakMap();
  
  function wrap(target, mapping) {
    if (target === null || typeof target !== 'object') return target;
    if (proxyCache.has(target)) return proxyCache.get(target);

    const handler = {
      get(obj, prop, receiver) {
        if (prop === Symbol.iterator) {
          return function* () {
            for (const value of obj) {
              yield wrap(value, mapping);
            }
          }(); 
        }
        const mangledProp = mapping[prop] || prop;
        const value = Reflect.get(obj, mangledProp, receiver);
        return wrap(value, mapping); // Recursively proxy
      },
      set(obj, prop, value, receiver) {
        const mangledProp = mapping[prop] || prop;
        return Reflect.set(obj, mangledProp, value, receiver);
      },
      has(obj, prop) {
        const mangledProp = mapping[prop] || prop;
        return Reflect.has(obj, mangledProp);
      }
    };

    const proxy = new Proxy(target, handler);
    proxyCache.set(target, proxy);
    return proxy;
  }

  return wrap;
})();

const customAIs = {};

async function loadCustomAI(id) {
  try {
    const resp = await fetch(`./_res_ai/${id}.js`, { cache: "no-store" });
    if (!resp.ok) return;

    let code = await resp.text();
    const ns = {};

    // i'm a real programmer, honest
    const transformedCode = code.replace(
      /function\s+([a-zA-Z0-9_]+)\s*\(/g,
      "ns.$1 = function("
    );
    new Function("ns", transformedCode)(ns);
    customAIs[id] = ns;
    console.log(
      `Loaded custom AI for ID ${id}. Found functions:`,
      Object.keys(ns).join(", ")
    );
  } catch (error) {
    console.error(error);
    customAIs[id] = null;
  }
}

const originalN0 = TIJj.prototype.n0;
TIJj.prototype.n0 = async function (...args) {
  await loadCustomAI(this.id);
  return await originalN0.apply(this, args);
};

// --- PATCHING ---

const originalTI2f = TI2f;
const originalCr0f = Cr0f;

TI2f = function (t, i) {
  const id = t.qt[i].q.id;

  const aiFunction = customAIs[id]?.id;
  if (typeof aiFunction === "function") {
    const proxiedGameInstance = getProxiedObject(t, nameMap);
    const newArgs = [proxiedGameInstance, i];
    try {
      return aiFunction.apply(this, newArgs);
    } catch (error) {
      console.error(error);
      return;
    }
  }
  return originalTI2f.apply(this, arguments);
};

Cr0f = function (e, s, q, t, h, o, a, n, r, i) {
  const entityId = e.qt[q].q.id;
  const aiFunction = customAIs[entityId]?.ego;
  if (typeof aiFunction === "function") {
    const proxiedGameInstance = getProxiedObject(e, nameMap);
    const newArgs = [proxiedGameInstance, s, q, t, h, o, a, n, r, i];
    try {
      return aiFunction.apply(this, newArgs);
    } catch (error) {
      console.error(error);
      return true;
    }
  }

  return originalCr0f.apply(this, arguments);
};
