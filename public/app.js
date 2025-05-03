const url = "https://api.quotable.io/quotes/random?minLength=220&maxLength=300";

const container = document.querySelector(".textarea-container");
const textarea = document.querySelector(".textArea");
const userInput = document.querySelector(".input-box");

let quote = "";
let mistakes = 0;
let backspaceCount = 0;

// how you render

const rendering = async () => {
  backspaceCount = 0;
  userInput.value = "";
  const res = await fetch(url);
  const data = await res.json();
  quote = data[0].content;
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
      console.log("thanks for completing");
      return rendering();
    }

    // Update current position based on cursor location
    currentPosition = e.target.selectionStart;

    cq.forEach(async (cq, index) => {
      if (index === currentPosition) {
        // Only move cursor when we reach the current typing position
        await cartemove(cq, index, cq);
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

  // Handle cursor positioning when clicking in the input
  userInput.addEventListener("click", (e) => {
    currentPosition = e.target.selectionStart;
    const characterQuotes = document.querySelector(".quote-container");
    const cq = Array.from(characterQuotes.querySelectorAll("letter"));
    if (cq[currentPosition]) {
      cartemove(cq[currentPosition], currentPosition, cq[currentPosition]);
    }
  });
};
// -------------------------carter
function cartemove(char, position, element) {
  // Add this to your input event listener
  handleTyping();
  let carter = document.querySelector(".carter");

  // Calculate cumulative position by getting the position of all previous characters
  const quoteContainer = document.querySelector(".quote-container");
  const allLetters = Array.from(quoteContainer.querySelectorAll("letter"));

  // Get the position of the current character in the sequence
  const currentChar = allLetters[position];

  if (currentChar) {
    // Get the position relative to the quote container
    const containerRect = quoteContainer.getBoundingClientRect();
    const charRect = currentChar.getBoundingClientRect();
    // console.log(charRect.left, containerRect.left);
    // console.log(charRect.top, containerRect.top);
    // Position the cursor at the end of the current character
    carter.style.position = "absolute";
    carter.style.left = `${charRect.left - containerRect.left}px`;
    carter.style.top = `${charRect.top - containerRect.top}px`;
    carter.style.opacity = "1";
  }
}
// ---------------------------When user is actively typing
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

//--------------------------carter
// how is rect findout
const checkAval = setInterval(() => {
  const mytextContainer = document.querySelectorAll(".quote-container .word ");
  if (mytextContainer.length) {
    clearInterval(checkAval);
    let arr = [...mytextContainer];
    // console.log(arr.length);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1] === undefined) {
        break;
      }
      let arrValrect = arr[i].getBoundingClientRect().y;
      let arrVal2rrect = arr[i + 1].getBoundingClientRect().y;
      if (
        arr[i + 1].getBoundingClientRect().y > arr[i].getBoundingClientRect().y
      ) {
        // let floatval = arrVal2rrect;
        // let anotherfval = arrValrect;
        let strval = arr[i].innerText;
        tomoveup(strval);
      }
    }
  }
}, 300);

// sending rect value to findout char index
function tomoveup(s) {
  // console.log("fucntion called");
  let trackedWords = [];

  userInput.addEventListener("keydown", (e) => {
    let key = e.key;

    // if (key.length > 1) return; // Ignore spaces and special keys

    trackedWords.push(key); // Track the letters being typed

    let joined = trackedWords.join("");
    let words = joined.split(" ");

    if (words.includes(s)) {
      moveup(trackedWords);
      trackedWords = []; // Now reset your tracking array
    }
  });
}

// matching char index accordint to rect and transforming
const moveup = (tw) => {
  const mytextContainer = document.querySelectorAll(".quote-container .word ");
  if (mytextContainer.length) {
    let arr = [...mytextContainer];

    arr.map((e) => {
      let arr4 = [...e.childNodes];
      arr4.map((e) => {
        tw.map((ex) => {
          if (
            (e.innerText === ex && e.classList.contains("success")) ||
            e.classList.contains("failure")
          ) {
            e.classList.add("transform");
          }
        });
      });
    });
  }
};
// initial setup's
xyz();
rendering();

// basic setup's
window.onload = () => {
  userInput.value = "";
};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
    e.preventDefault();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "r" || e.key === "Alt")) {
    location.reload();
    console.log("done");
  }
});

// user focus to on
textarea.addEventListener("click", (e) => {
  userInput.focus();
});

//backspace wala
const maxBackspacesAllowed = 5; // Adjust as needed
document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    if (backspaceCount >= maxBackspacesAllowed) {
      e.preventDefault(); // Block after limit
      document.querySelector(".notification").style.display = "block";
      setTimeout(() => {
        document.querySelector(".notification").style.display = "none";
      }, 1000);
      if (backspaceCount > 5) {
        e.preventDefault();
        return;
      }
      setTimeout(() => {
        backspaceCount = 0;
      }, 5000);
    } else {
      backspaceCount++;
      console.log(`Backspaces left: ${maxBackspacesAllowed - backspaceCount}`);
    }
  }
});

// sword gsap svg use
document.addEventListener("mousemove", (e) => {
  gsap.set(".sss", {
    x: e.x,
    y: e.y,
  });
});
// refresh icon btn
const refrehtbn = document.querySelector(".bi-arrow-clockwise");
refrehtbn.addEventListener("click", () => {
  rendering();
});
function thanks() {
  let thanks = document.getElementById("thanks");
  thanks.style.display = thanks.style.display === "none" ? "block" : "none";
}

function version() {
  console.log("hey");
  let v = document.querySelector(".version");
  v.style.display = "block";
}
