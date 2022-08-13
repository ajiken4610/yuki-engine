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
