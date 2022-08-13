import { WebGLRenderer } from "three";

const renderer = new WebGLRenderer();
export const useWebGLRenderer = () => renderer;

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
