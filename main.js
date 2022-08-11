import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const sizes = {
  widht: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(35, sizes.widht / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.widht, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// オブジェクト
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86, // 金属光沢度合
  roughness: 0.37, // 荒さ
  flatShading: true, // true=ポリゴンが見える, false=滑らかになる
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

//メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);
//回転用に配置
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);
scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

// ライトを追加
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // サイズのアップデート
  sizes.widht = window.innerWidth;
  sizes.height = window.innerHeight;
  // カメラアップデート
  camera.aspect = sizes.widht / sizes.height;
  camera.updateProjectionMatrix();
  // レンダラーアップデート
  renderer.setSize(sizes.widht, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// ホイール実装
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0002;
  console.log(speed);
});

const rot = () => {
  //毎フレームごとにスピードがプラスされていくの慣性みたいなものをかけることができる
  rotation += speed;
  // 0.93をかけることでいずれ0に近ずくため減衰して止まる
  speed *= 0.93;

  // ジオメトリ全体を回転させる
  // 半径 * Math.cos(rotation)
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(rot);
};
rot();

//カーソルの位置
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / window.innerWidth - 0.5;
  cursor.y = e.clientY / window.innerHeight - 0.5;
});

// アニメーション
const clock = new THREE.Clock();
const animation = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();

  meshes.map((mesh) => {
    // meshを回転
    // PCのスペックによって回転スピードが変わってしまうので、deltaTimeを取得してかけている
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  });

  //カメラ制御
  camera.position.x += cursor.x * getDeltaTime * 2;
  camera.position.y += -cursor.y * getDeltaTime * 2;

  window.requestAnimationFrame(animation);
};
animation();
