let activeImages = [];
let imagesToHide = [];

const cyclingImages = document.querySelectorAll(
  ".image[data-category='cycling']"
);
const photographyImages = document.querySelectorAll(
  ".image[data-category='photography']"
);
const foodImages = document.querySelectorAll(".image[data-category='food']");

const MAX_IMAGES_ON_SCREEN = 5;
const PERCENTAGE_THRESHOLD_FOR_NEXT_IMAGE = 0.08;

let currentImageIndex = 0;
let currentZIndex = 0;
let imagesOnScreen = 0;
let prevCoordinates = { x: 0, y: 0 };

function showImage(image, x, y) {
  image.style.left = `${x}px`;
  image.style.top = `${y}px`;
  image.style.zIndex = currentZIndex;

  image.dataset.status = "active";

  prevCoordinates = { x, y };

  currentZIndex++;
  currentImageIndex++;

  if (imagesOnScreen < Math.min(activeImages.length, MAX_IMAGES_ON_SCREEN)) {
    imagesOnScreen++;
  }
}

function hideImage(image) {
  image.dataset.status = "inactive";
}

function getDistanceFromPrevImage(x, y) {
  return Math.hypot(x - prevCoordinates.x, y - prevCoordinates.y);
}

function handleOnMove(e) {
  if (!activeImages.length) {
    return;
  }

  // Display next image if cursor has moved a set % of viewport width
  if (
    getDistanceFromPrevImage(e.clientX, e.clientY) >
    window.innerWidth * PERCENTAGE_THRESHOLD_FOR_NEXT_IMAGE
  ) {
    if (currentImageIndex === activeImages.length) {
      currentImageIndex = 0;
    }

    if (
      imagesOnScreen === Math.min(activeImages.length, MAX_IMAGES_ON_SCREEN)
    ) {
      hideImage(imagesToHide.shift());
    }

    imagesToHide.push(activeImages[currentImageIndex]);
    showImage(activeImages[currentImageIndex], e.clientX, e.clientY);
  }
}

function handleReset(e) {
  document.querySelectorAll(".image").forEach((element) => {
    element.setAttribute("data-status", "inactive");
  });

  imagesToHide = [];
  currentImageIndex = 0;
  currentZIndex = 0;
  imagesOnScreen = 0;
  prevCoordinates = { x: 0, y: 0 };

  handleOnMove(e);
}

/* ---------------------------
 *  Attaching Event Handlers
 * --------------------------- */

window.onmousemove = (e) => handleOnMove(e);

window.ontouchmove = (e) => handleOnMove(e.touches[0]);

document
  .querySelector(".image-button#cycling")
  .addEventListener("click", (e) => {
    activeImages = cyclingImages;
    handleReset(e);
  });

document
  .querySelector(".image-button#photography")
  .addEventListener("click", (e) => {
    activeImages = photographyImages;
    handleReset(e);
  });

document.querySelector(".image-button#food").addEventListener("click", (e) => {
  activeImages = foodImages;
  handleReset(e);
});
