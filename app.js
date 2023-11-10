const slider = document.querySelector(".slider-container");
const slides = Array.from(document.querySelectorAll(".slide"));

// global variables
let isDragging = false,
  currentIndex = 0,
  currentTranslate = 0,
  startPosition = 0,
  prevTranslate = 0,
  animationID;

slides.forEach((slide, index) => {
  // preventing default image drag prop
  const sliderImage = slide.querySelector("img");
  sliderImage.addEventListener("dragstart", (e) => e.preventDefault());

  // mouse and touch functions
  slide.addEventListener("pointerdown", pointerDown(index));
  slide.addEventListener("pointerup", pointerUp);
  slide.addEventListener("pointerleave", pointerUp);
  slide.addEventListener("pointermove", pointerMove);
});

// set position by index on resize
window.addEventListener("resize", setPositionByIndex);

// prevent menu popup on right click press
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// pointer down
function pointerDown(index) {
  return function (event) {
    // setting slides index to currentIndex
    currentIndex = index;
    isDragging = true;
    // setting start position of pointer
    startPosition = event.clientX;
    animationID = requestAnimationFrame(animation);

    // adding grabbing class
    slider.classList.add("grabbing");
  };
}
// pointer up
function pointerUp() {
  console.log("pointer up");
  // canceling request animation
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;

  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;
  // setting transform of slide based on index
  setPositionByIndex();
  // removing grabbing class
  slider.classList.remove("grabbing");
}

// pointer move
function pointerMove(event) {
  console.log("pointer move");
  if (isDragging) {
    const currentPosition = event.clientX;
    currentTranslate = prevTranslate + currentPosition - startPosition;
  }
}

// setting slider position
function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

// setting slider position
function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}

// animation for request animationframe
function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}
