
const container = document.querySelector(".textarea-container");
const textarea = document.querySelector(".textArea");
const userInput = document.querySelector(".input-box");

let quote = "";
let mistakes = 0;
let backspaceCount = 0;
let totalwords;
let count=0;
let data =[]
let startTime= Date.now();
let currentWordCount = 0;


// how you render
let dop = document.querySelector(".dp");
let iconsAa = document.querySelector(".iconsAa");
function dp(icon) {
  dop.style.display = dop.style.display === "none" ? "block" : "none";
}

function counter (tw,count) {
  console.log('hi')

  if(count) {
document.querySelector('.counter').innerText = count;
  }
  else{
    const counterDiv = document.createElement('div');  // Create the div element
    counterDiv.classList.add('counter-div');
    counterDiv.innerHTML = `
    <span class="counter">${count}</span> 
    /
    <span>${tw}</span>
  `;
    document.body.appendChild(counterDiv);
  }
}


const rendering = async () => {
  xyz();
  userInput.value = "";
  const response = await fetch("/api/random-quote");
  const data = await response.json();
  quote = data.content;
totalwords = quote.length;
  counter(Math.floor(totalwords /5),count)

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
      wpm(totalwords,mistakes);
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
          if(userInputChars[index] == " " && cq.innerText == "")
          {
mistakes= mistakes -1;
          }
          cq.classList.add("failure");
          mistakes = mistakes + 1;
        }
      }
    });
  });
};
// above two fx are Main(). EG: Workstation
function addarr(currentWordCount){
  const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
  const grossWpm = currentWordCount / 5 / elapsedMinutes;
  data.push(Math.round(grossWpm))
}
function wpm(totalWords,mistakes) {
  clearInterval(interval1);
  const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
  const grossWpm = Math.round(totalWords / 5 / elapsedMinutes);
const wordMistakes = Math.round(mistakes  /5 -elapsedMinutes);
const accuracy = Math.round(Math.max(0,(totalWords - mistakes)/ totalWords * 100));
  const netWpm = Math.max(0, (grossWpm - wordMistakes / elapsedMinutes )); // Prevent negative WPM
  const finalnetWpm=  Math.round(netWpm);
  let chartwrapper = document.querySelector(".chart-wrapper");
  chartwrapper.style.display = "flex";
  updateWPMDisplay(finalnetWpm,grossWpm,accuracy,wordMistakes); // Call this with your actual WPM value
}
// above fx works first as user completed the game
// downward fx works to show user their speed with better UI/UX
function updateWPMDisplay(netWpm,grossWpm,accuracy,wordMistakes) {
  drawChart(grossWpm);
  window.addEventListener('resize', () => {
    drawChart(grossWpm);
  });
  const wpmElement = document.querySelector(".wpm-value");
  const wpmElementRaw = document.querySelector(".wpm-value-raw");
  const wpmdivs = document.querySelector('.wpmdivs')
  const accuracySpan = document.querySelector('.wpm-value-raw-accuracy')
const mistakeSpan = document.querySelector('.wpm-value-raw-mistakes')
  wpmdivs.style.display= 'flex';
  const duration = 1000; // Animation duration in milliseconds
  const startTime = performance.now();
  const startValue = 0;
  requestAnimationFrame(animateWPM);
  function animateWPM(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Ease-out function for smoother animation
    const easedProgress = 1 - Math.pow(1 - progress, 2);

    wpmElement.textContent =  Math.floor(easedProgress * netWpm);
    wpmElementRaw.textContent = Math.floor(easedProgress * grossWpm)
    accuracySpan.textContent = Math.floor(easedProgress * accuracy);
    mistakeSpan.textContent = Math.floor(easedProgress * wordMistakes);

    if (progress < 1) {
      requestAnimationFrame(animateWPM);
    } else {
      wpmElement.textContent = netWpm; // Ensure final value is exact
      wpmElementRaw.textContent= grossWpm;
      accuracySpan.textContent = `${accuracy}%`;
      mistakeSpan.textContent = wordMistakes;
    }
  }
  textarea.textContent = "";
  function drawChart(grossWpm) {
    const svg = document.getElementById("lineChart");
    const chartContainer = document.getElementById("chartContainer");
    svg.innerHTML = "";

    const height = chartContainer.clientHeight;
    const padding = 90;
    const pointSpacing = 120;
    const width = padding * 2 + (data.length - 1) * pointSpacing;
    svg.setAttribute("width", width);
    chartContainer.style.minWidth = width + "px";

    const minData = 0;
    const maxDataRaw = Math.max(...data);
    const maxData = Math.ceil(maxDataRaw / 50) * grossWpm ;

    const range = maxData - minData;

    drawYAxis(minData, maxData);

    const points = data.map((val, i) => {
      const x = padding + i * pointSpacing;
      const y = height - padding - ((val - minData) / range) * (height - 1 * padding);
      return [x, y];
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
    path.setAttribute("d", d);
    path.setAttribute("class", "line");
    svg.appendChild(path);

    // Animate line
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 1.5s ease-out";
    path.style.strokeDashoffset = "0";

    // Add dots
    points.forEach(([x, y]) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", window.innerWidth <= 600 ? 3 : 5);
      circle.setAttribute("class", "dot");
      svg.appendChild(circle);
    });
  }

  function drawYAxis(minVal, maxVal) {
    const yAxis = document.getElementById("yAxisLabels");
    yAxis.innerHTML = "";
    const steps = 1;

    const stepSize = (maxVal - minVal) / steps;

    for (let i = steps; i >= 0; i--) {
      const label = document.createElement("div");
      label.innerText = Math.round(minVal + i * stepSize);
      yAxis.appendChild(label);
    }
  }
}

// -------------------------carter
function cartemove(position) {
  // Add this to your input event listener
  handleTyping();
  let carter = document.querySelector(".carter");

  // Calculating  cumulative position by getting the position of all previous charactzers
  const quoteContainer = document.querySelector(".quote-container");
  if(quoteContainer==null) return;
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
  if(carter == null)
  {return;}

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
  interval1=setInterval(()=>{addarr(currentWordCount)},3000)
userInput.addEventListener("input", (e) => {
  try{
    if (e.inputType==='deleteContentBackward') return;
    currentWordCount = Math.round(e.target.value.split("").length / 5);
counter(Math.floor(totalwords / 5),currentWordCount)
    const quoteContainer = document.querySelector(".quote-container")
    const allLetters = Array.from(quoteContainer.querySelectorAll("letter")).filter((e)=>!e.classList.contains('space') || e.classList.contains('success') || e.classList.contains('failure') )  ;
    const characters = allLetters[e.target.selectionStart-2];
    const characters1 = allLetters[e.target.selectionStart-1];


  let p = Math.floor(characters?.getBoundingClientRect().y)
  let p1 = Math.floor(characters1?.getBoundingClientRect().y)

  if (p1 > p ) {

    moveup()

  }

  }
  catch(e){
    console.log(e)
  }
});
})()

// matching char index accordingg to rect and transforming
const moveup = () => {
  const mytextContainer = document.querySelectorAll(".quote-container .word ");

  if (mytextContainer.length) {
    let arr = [...mytextContainer];

    arr.map((e) => {
      let arr4 = [...e.childNodes].filter(e=>e.classList.contains('success') || e.classList.contains('failure') || e.classList.contains('space'));

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

