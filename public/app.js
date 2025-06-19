const url = "https://api.quotable.io/quotes/random?minLength=20&maxLength=100";

const container = document.querySelector(".textarea-container");
const textarea = document.querySelector(".textArea");
const userInput = document.querySelector(".input-box");

let quote = "";
let mistakes = 0;
let backspaceCount = 0;

// how you render
let dop = document.querySelector(".dp");
let iconsAa = document.querySelector(".iconsAa");
function dp(icon) {
  dop.style.display = dop.style.display === "none" ? "block" : "none";
}

const rendering = async () => {
  xyz();
  userInput.value = "";
  const response = await fetch("/api/random-quote");
  const data = await response.json();
  quote = data.content;

  // now the quote to be changed in an array

  const words = quote
    .split(" ")
    .map((word) => {
      const letters = [...word]
        .map((letter) => `<letter class="">${letter}</letter>`)

        .join("");
      return `
      <div class="word">${letters}</div>
      <letter class="space"></letter>
      `;
    })
    .join(" ");

  let div = document.createElement("span");
  div.classList.add("carter");

  textarea.innerHTML = `
<div class = "quote-container"> 
${div.outerHTML}
${words}
</div>`;
};
const xyz = async () => {
  let currentPosition = 0; // Track current cursor position globally

  userInput.addEventListener("input", (e) => {
    const characterQuotes = document.querySelector(".quote-container");
    let cq = Array.from(characterQuotes.querySelectorAll("letter"));
    const userInputChars = Array.from(e.target.value);

    if (cq.length - 1 === userInputChars.length) {
      // console.log("thanks for completing");
      let totalwords = userInputChars.length;
      let timer = 30;
      let count = 0;
      for (arr of cq) {
        if (arr.classList.contains("failure")) {
          count++;
        }
      }
      console.log(count)
      let uncorrectedErrors = count;

      wpm(totalwords, timer, uncorrectedErrors);
      // return rendering();
    }

    // Update current position based on cursor location
    currentPosition = e.target.selectionStart;
    cq.forEach((cq, index) => {

      if (index === currentPosition) {
        // Only move cursor when we reach the current typing position
        cartemove(index);
      }

      if (cq.innerText === userInputChars[index]) {
        cq.classList.add("success");
        cq.classList.remove("failure");
      } else if (userInputChars[index] == null) {
        cq.classList.remove("success", "failure");
      } else {
        if (!cq.classList.contains("failure")) {
          cq.classList.add("failure");
          mistakes++;
        }
      }
    });
  });
};
// above two fx are Main(). EG: Workstation


function wpm(tw, timer, ucE) {
  let grossWpm = (tw / 5 / 60) * 100;
  let netWpm = grossWpm - ucE / 60;
  let finalnetWpm = parseInt(netWpm);
  // console.log({ tw, timer, ucE });
  let wpmContainer = document.querySelector(".wpm-container");
  wpmContainer.style.display = "block";

  // Example usage:
  // console.log(finalnetWpm);
  updateWPMDisplay(finalnetWpm); // Call this with your actual WPM value
}
// above fx works first as user completed the game
// downward fx works to show user their speed with better UI/UX
function updateWPMDisplay(netWpm) {
  const wpmElement = document.querySelector(".wpm-value");
  const duration = 2000; // Animation duration in milliseconds
  const startTime = performance.now();
  const startValue = 0;

  requestAnimationFrame(animateWPM);

  function animateWPM(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Ease-out function for smoother animation
    const easedProgress = 1 - Math.pow(1 - progress, 2);

    Math.floor(easedProgress * netWpm);
    wpmElement.textContent =    Math.floor(easedProgress * netWpm);

    if (progress < 1) {
      requestAnimationFrame(animateWPM);
    } else {
      wpmElement.textContent = netWpm; // Ensure final value is exact
    }
  }
}

// -------------------------carter
function cartemove(position) {
  // Add this to your input event listener
  handleTyping();
  let carter = document.querySelector(".carter");

  // Calculating  cumulative position by getting the position of all previous characters
  const quoteContainer = document.querySelector(".quote-container");
  const allLetters = Array.from(quoteContainer.querySelectorAll("letter"));

  const currentChar = allLetters[position];
  if (currentChar) {
    const containerRect = quoteContainer.getBoundingClientRect();
    const charRect = currentChar.getBoundingClientRect();

    carter.style.position = "absolute";
    carter.style.left = `${charRect.left - containerRect.left}px`;
    carter.style.top = `${charRect.top - containerRect.top}px`;
    carter.style.opacity = "1";
  }
}
// ---------------------------When user is actively typing CSS
function handleTyping() {
  const carter = document.querySelector(".carter");
  carter.classList.add("typing");
  carter.classList.remove("idle");

  // Reset after typing stops
  clearTimeout(window.typingTimeout);
  window.typingTimeout = setTimeout(() => {
    carter.classList.remove("typing");
    carter.classList.add("idle");
  }, 1000);
}

(()=>{

userInput.addEventListener("input", (e) => {
  try{



  const quoteContainer = document.querySelector(".quote-container")
  const allLetters = Array.from(quoteContainer.querySelectorAll("letter")).filter((e)=>!e.classList.contains('space') || e.classList.contains('success') || e.classList.contains('failure')  || e.classList.contains('failure'))  ;
  const characters = allLetters[e.target.selectionStart-1];

  let characters1 = allLetters[e.target.selectionStart];


  let p = Math.floor(characters.getBoundingClientRect().y)
  let p1 = Math.floor(characters1.getBoundingClientRect().y)


  if (p1 > p ) {
    moveup()
  }
  // if(p1>p) console.log('here you will move up')
  // console.log(quoteContainer.getBoundingClientRect()) ;

  }
  catch(e){}
});

})()

// matching char index accordingg to rect and transforming
const moveup = () => {
  const mytextContainer = document.querySelectorAll(".quote-container .word ");
  if (mytextContainer.length) {
    let arr = [...mytextContainer];

    arr.map((e) => {
      let arr4 = [...e.childNodes];
      arr4.map((e) => {
        if (
          e.classList.contains("success") ||
          e.classList.contains("failure")
        ) {
          e.classList.add("transform");
        }
      });
    });
  }
};


















// BACKSPACE fx
const maxBackspacesAllowed = 5;
document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    if (backspaceCount >= maxBackspacesAllowed) {
      e.preventDefault(); // Block further backspaces
      const notification = document.querySelector(".notification");
      notification.style.display = "block";

      setTimeout(() => {
        notification.style.display = "none";
      }, 1000);

      // Reset counter after 5 seconds
      setTimeout(() => {
        backspaceCount = 0;
      }, 5000);
    } else {
      backspaceCount++;
      // Optionally log remaining count
      // console.log(`Backspaces used: ${backspaceCount}`);
    }
  }
});
//  GSAP SWORD svg use
document.addEventListener("mousemove", (e) => {
  gsap.set(".sss", {
    x: e.x,
    y: e.y,
  });
});
// DOM fx
function version() {
  // console.log("hey");
  let v = document.querySelector(".version");
  v.style.display = v.style.display === "none" ? "block" : "none";
}
function dark(icon) {
  document.body.classList.toggle("dark-theme");
  icon.classList.toggle("bi-moon-fill");
  icon.classList.toggle("bi-brightness-alt-high-fill");
}
textarea.addEventListener("click", (e) => {
  userInput.focus();
});
function thanks() {
  let thanks = document.getElementById("thanks");
  thanks.style.display = thanks.style.display === "none" ? "block" : "none";
}
const refrehtbn = document.querySelector(".bi-arrow-clockwise");
refrehtbn.addEventListener("click", () => {
  rendering();
  location.reload();
});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
    e.preventDefault();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "r" || e.key === "Alt")) {
    location.reload();
  }
});
let setting = document.querySelector(".settings");
let hawa = document.querySelector(".hawa");
setting.addEventListener("click", (req, res) => {
  if (hawa.style.display === "none") {
    hawa.style.display = "block";
  } else {
    hawa.style.display = "none";
  }
});
// initial setup's
rendering();
window.onload = () => {
  userInput.value = "";
};

