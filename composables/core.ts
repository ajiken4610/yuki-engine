import { PerspectiveCamera, WebGLRenderer } from "three";
const renderer = new WebGLRenderer();
renderer.autoClear = false;
renderer.setClearAlpha(0);
export const useWebGLRenderer = () => renderer;
export const useDefaultCamera = () => {
  const ret = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  ret.position.set(2, 2, 2);
  ret.lookAt(0, 0, 0);
  return ret;
};
export const useGLObjects = () =>
  new Proxy(
    {},
    {
      set(obj, prop, val) {
        if (prop in obj && typeof obj[prop].dispose === "function") {
          obj[prop].dispose();
        }
        obj[prop] = val;
        return true;
      },
      deleteProperty(obj, prop) {
        if (prop in obj) {
          delete obj[prop];
        }
        return true;
      },
    }
  );
export const traverseObject = (
  object: object,
  callback: (x: unknown) => unknown
) => {
  if (Object.prototype.toString.call(object) === "[object Array]") {
    const array = object as Array<any>;
    for (const current of array) {
      callback(current);
      traverseObject(current, callback);
    }
  } else if (typeof object === "object") {
    for (const current in object) {
      callback(object[current]);
      traverseObject(object[current], callback);
    }
  } else {
    callback(object);
  }
};
export const finalizeGLObjects = (object: { [key: string]: any }) => {
  for (const key in object) {
    if (typeof object[key].dispose === "function") {
      object[key].dispose();
    }
  }
};

export const useBooleanArray = () => {
  let filling = false;
  return new Proxy([] as boolean[], {
    get: (target, prop, receiver) => {
      if (prop === "filling") {
        return (val: boolean, start?: number, end?: number) => {
          filling = true;
          return target.fill(val, start, end);
        };
      }
      if (target[prop] === undefined) {
        return (target[prop] = filling);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("load", () => {
  document.body.appendChild(renderer.domElement);
  onResize();
});
window.addEventListener("resize", onResize);

// let suspensePromises: {
//   onSuspenseFinish?: () => void;
// }[] = [];

// export const suspense = () => {
//   const suspensePromise: {
//     onSuspenseFinish?: () => void;
//   } = {};
//   suspensePromises.push(suspensePromise);
//   return () => {
//     if (suspensePromise.onSuspenseFinish) suspensePromise.onSuspenseFinish;
//     suspensePromises = suspensePromises.filter(
//       (val) => val !== suspensePromise
//     );
//   };
// };
// export const initCore = () => {
//   useRouter().beforeEach(async (to, from, next) => {
//     const promises: Promise<unknown>[] = [];
//     for (const suspense of suspensePromises) {
//       promises.push(
//         new Promise((resolve) => {
//           suspense.onSuspenseFinish = () => resolve;
//         })
//       );
//     }
//     await Promise.all(promises);
//     next();
//   });
// };
