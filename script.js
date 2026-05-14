const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  const links = document.querySelectorAll(".nav-links a");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

const contactToggle = document.getElementById("contactToggle");
const contactMenu = document.getElementById("contactMenu");

if (contactToggle && contactMenu) {
  contactToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    contactMenu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    contactMenu.classList.remove("active");
  });

  contactMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
/* -----------------------------------------
   CUCARACHA PEQUEÑA FLOTANTE
   - Se mueve libremente por la pantalla
   - No reacciona al mouse
   - Cambia de dirección aleatoriamente
   - Rebota en bordes
   - Camina con animación de patas
------------------------------------------ */

const roach = document.getElementById("roach");

if (roach) {
  let x = window.innerWidth * 0.72;
  let y = window.innerHeight * 0.58;

  let angle = Math.random() * Math.PI * 2;
  let targetAngle = angle;

  let speed = 0.55;
  let targetSpeed = 0.7;

  let nextDecisionTime = performance.now() + randomBetween(1200, 2600);
  let pauseUntil = 0;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function normalizeAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function getRoachSize() {
    return roach.getBoundingClientRect().width || 28;
  }

  function chooseNewDirection(now, fromBounce = false) {
    targetAngle = angle + randomBetween(-1.4, 1.4);

    if (fromBounce) {
      targetAngle = angle + randomBetween(-0.6, 0.6);
    }

    targetSpeed = randomBetween(0.35, 0.95);

    if (Math.random() < 0.16) {
      pauseUntil = now + randomBetween(500, 1200);
    }

    nextDecisionTime = now + randomBetween(1300, 3200);
  }

  function bounceInsideViewport(size, now) {
    let bounced = false;

    if (x <= 0) {
      x = 0;
      angle = Math.PI - angle;
      bounced = true;
    }

    if (x >= window.innerWidth - size) {
      x = window.innerWidth - size;
      angle = Math.PI - angle;
      bounced = true;
    }

    if (y <= 0) {
      y = 0;
      angle = -angle;
      bounced = true;
    }

    if (y >= window.innerHeight - size) {
      y = window.innerHeight - size;
      angle = -angle;
      bounced = true;
    }

    if (bounced) {
      chooseNewDirection(now, true);
    }
  }

  function animateRoach(now) {
    const size = getRoachSize();

    if (now >= nextDecisionTime) {
      chooseNewDirection(now);
    }

    const isPaused = now < pauseUntil;

    if (isPaused) {
      speed += (0 - speed) * 0.08;
      roach.classList.remove("walking");
    } else {
      const delta = normalizeAngle(targetAngle - angle);
      angle += delta * 0.035;
      speed += (targetSpeed - speed) * 0.03;
      roach.classList.add("walking");
    }

    if (!isPaused) {
      angle += (Math.random() - 0.5) * 0.01;
    }

    x += Math.cos(angle) * speed;
    y += Math.sin(angle) * speed;

    bounceInsideViewport(size, now);

    x = clamp(x, 0, window.innerWidth - size);
    y = clamp(y, 0, window.innerHeight - size);

    const deg = (angle * 180) / Math.PI + 90;

    roach.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`;

    requestAnimationFrame(animateRoach);
  }

  window.addEventListener("resize", () => {
    const size = getRoachSize();
    x = clamp(x, 0, window.innerWidth - size);
    y = clamp(y, 0, window.innerHeight - size);
  });

  requestAnimationFrame(animateRoach);
}