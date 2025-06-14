




// home page image scroll effect
let ticking = false;

window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

function handleScroll() {
  const image = document.querySelector(".third-left .zoom-image");
  const section = document.querySelector(".third-left");

  if (!image || !section) return;

  const sectionTop = section.getBoundingClientRect().top;
  const sectionHeight = section.offsetHeight;
  const windowHeight = window.innerHeight;

  if (sectionTop <= windowHeight && sectionTop + sectionHeight >= 0) {
    const visibleRatio = 1 - Math.max(0, sectionTop) / windowHeight;
    const scale = 1 + visibleRatio * 0.1; // zooms from 1.0 to 1.1
    image.style.transform = `scale(${scale})`;
  }
}

// home page product slider
const sliderTrack = document.getElementById("sliderTrack");
const cards = document.querySelectorAll(".slider-card");

let index = 0;
const total = 5;

if (sliderTrack) {
  setInterval(() => {
    index = (index + 1) % total;
    sliderTrack.style.transform = `translateX(-${index * 316}px)`; // 300px card + 16px margin
  }, 2000);
}

// home products modal
document.querySelectorAll('.view-btn').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const modalId = button.getAttribute('data-modal-id');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
    }
  });
});

document.querySelectorAll('.home-modal-close-btn').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    const modal = closeBtn.closest('.home-modal');
    if (modal) modal.style.display = 'none';
  });
});

window.addEventListener('click', e => {
  document.querySelectorAll('.home-modal').forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

// registration form validation
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.register-form');
  if (!form) return; // Safe check

  form.addEventListener('submit', function (e) {
    let valid = true;

    const errorSpans = form.querySelectorAll('.error-msg');
    errorSpans.forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });

    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const mobile = form.querySelector('input[name="mobile"]');
    const gender = form.querySelector('select[name="gender"]');
    const photo = form.querySelector('input[name="photo"]');
    const password1 = form.querySelector('input[name="password1"]');
    const password2 = form.querySelector('input[name="password2"]');
    const address = form.querySelector('textarea[name="address"]');

    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const mobilePattern = /^\d{10}$/;

    if (!name.value.trim() || !namePattern.test(name.value.trim())) {
      name.nextElementSibling.textContent = "Enter a valid name (letters only).";
      name.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      email.nextElementSibling.textContent = "Enter a valid email.";
      email.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!mobile.value.trim() || !mobilePattern.test(mobile.value.trim())) {
      mobile.nextElementSibling.textContent = "Enter a 10-digit mobile number.";
      mobile.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!gender.value) {
      gender.nextElementSibling.textContent = "Please select your gender.";
      gender.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!photo.value) {
      photo.nextElementSibling.textContent = "Please upload a photo.";
      photo.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!password1.value || password1.value.length < 6) {
      password1.nextElementSibling.textContent = "Password must be at least 6 characters.";
      password1.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (password1.value !== password2.value) {
      password2.nextElementSibling.textContent = "Passwords do not match.";
      password2.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!address.value.trim()) {
      address.nextElementSibling.textContent = "Enter your address.";
      address.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!valid) {
      console.log("Validation failed.");
      e.preventDefault();
    }
  });
});

// login form validation
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.login-form');
  if (!form) return; // Don't run if form not found

  form.addEventListener('submit', function (e) {
    let valid = true;

    const errorSpans = form.querySelectorAll('.error-msg');
    errorSpans.forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });

    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      email.nextElementSibling.textContent = "Enter a valid email.";
      email.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!password.value || password.value.length < 6) {
      password.nextElementSibling.textContent = "Password must be at least 6 characters.";
      password.nextElementSibling.style.display = "block";
      valid = false;
    }

    if (!valid) e.preventDefault();
  });
});

function price_calculate(quantity, price){
  var final_price = parseInt(quantity)* parseInt(price);
  const priceEl = document.getElementById('price');
  if (priceEl) priceEl.textContent = final_price;
}

function openAddProductModal() {
  const modal = document.getElementById("addProductModal");
  if (modal) modal.style.display = "block";
}

function closeAddProductModal() {
  const modal = document.getElementById("addProductModal");
  if (modal) modal.style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("addProductModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const newsletterToggle = document.getElementById('newsletterToggle');
if (newsletterToggle) {
  newsletterToggle.addEventListener('change', function () {
    console.log("Newsletter toggle:", this.checked);
    // Optional: Send AJAX to backend to update DB
  });
}

const notificationsToggle = document.getElementById('notificationsToggle');
if (notificationsToggle) {
  notificationsToggle.addEventListener('change', function () {
    console.log("Notifications toggle:", this.checked);
    // Optional: Send AJAX to backend to update DB
  });
}

