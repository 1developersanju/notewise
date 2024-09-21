(function () {
  const win = window;
  const doc = document.documentElement;

  // Remove no-js class and add js class
  doc.classList.remove('no-js');
  doc.classList.add('js');

  // Reveal animations
  if (document.body.classList.contains('has-animations')) {
    /* global ScrollReveal */
    const sr = window.sr = ScrollReveal();

    sr.reveal('.feature', {
      duration: 600,
      distance: '20px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      origin: 'right',
      interval: 100
    });

    sr.reveal('.media-canvas', {
      duration: 600,
      scale: '.95',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      viewFactor: 0.5
    });
  }

  // Wait for device mockup to load
  const deviceMockup = document.querySelector('.device-mockup');

  function deviceMockupLoaded() {
    deviceMockup.classList.add('has-loaded');
  }

  if (deviceMockup.complete) {
    deviceMockupLoaded();
  } else {
    deviceMockup.addEventListener('load', deviceMockupLoaded);
  }

  // Features title adjustment
  const featuresSection = document.querySelector('.features');
  const featuresTitle = featuresSection.querySelector('.section-title');
  const firstFeature = document.querySelector('.feature-inner');

  function featuresTitlePos() {
    let featuresSectionLeft = featuresSection.querySelector('.features-inner').getBoundingClientRect().left;
    let firstFeatureLeft = firstFeature.getBoundingClientRect().left;
    let featuresTitleOffset = parseInt(firstFeatureLeft - featuresSectionLeft);
    featuresTitle.style.marginLeft = firstFeatureLeft > featuresSectionLeft ? `${featuresTitleOffset}px` : 0;
  }

  featuresTitlePos();
  win.addEventListener('resize', featuresTitlePos);

  // Moving objects
  const movingObjects = document.querySelectorAll('.is-moving-object');

  // Throttling
  function throttle(func, milliseconds) {
    let lastEventTimestamp = null;
    let limit = milliseconds;

    return (...args) => {
      let now = Date.now();

      if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
        lastEventTimestamp = now;
        func.apply(this, args);
      }
    };
  }

  // Init vars
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let coordinateX = 0;
  let coordinateY = 0;
  let winW = doc.clientWidth;
  let winH = doc.clientHeight;

  // Move Objects
  function moveObjects(e, object) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    scrollY = win.scrollY;
    coordinateX = (winW / 2) - mouseX;
    coordinateY = (winH / 2) - (mouseY - scrollY);

    for (let i = 0; i < object.length; i++) {
      const translatingFactor = object[i].getAttribute('data-translating-factor') || 20;
      const rotatingFactor = object[i].getAttribute('data-rotating-factor') || 20;
      const perspective = object[i].getAttribute('data-perspective') || 500;
      let tranformProperty = [];

      if (object[i].classList.contains('is-translating')) {
        tranformProperty.push('translate(' + coordinateX / translatingFactor + 'px, ' + coordinateY / translatingFactor + 'px)');
      }

      if (object[i].classList.contains('is-rotating')) {
        tranformProperty.push('perspective(' + perspective + 'px) rotateY(' + -coordinateX / rotatingFactor + 'deg) rotateX(' + coordinateY / rotatingFactor + 'deg)');
      }

      if (object[i].classList.contains('is-translating') || object[i].classList.contains('is-rotating')) {
        tranformProperty = tranformProperty.join(' ');
        object[i].style.transform = tranformProperty;
        object[i].style.transition = 'transform 1s ease-out';
        object[i].style.transformStyle = 'preserve-3d';
        object[i].style.backfaceVisibility = 'hidden';
      }
    }
  }

  // Call function with throttling
  if (movingObjects) {
    win.addEventListener('mousemove', throttle(
      function (e) {
        moveObjects(e, movingObjects);
      },
      150
    ));
  }

  // Play Video Function
  function playVideo() {
    var videoContainer = document.getElementById('video-container');
    var iframe = document.getElementById('youtube-video');
    var control = document.querySelector('.media-control svg');

    if (videoContainer.style.display === 'none') {
      // Set the YouTube video URL
      iframe.src = 'https://www.youtube.com/embed/9uyh6KSYVJ4?autoplay=1'; // Replace YOUR_VIDEO_ID with the actual video ID

      videoContainer.style.display = 'block';
      control.style.display = 'none'; // Hide play button when video is playing
    }
  }

  // Expose playVideo to global scope if needed
  window.playVideo = playVideo;

}());
