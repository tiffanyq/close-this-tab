let toForURL="";
let fromForURL="";


const BASE_URL = "https://closethistab.com?"
const ALPHABET = {
  "a": "n",
  "b": "o",
  "c": "p",
  "d": "q",
  "e": "r",
  "f": "s",
  "g": "t",
  "h": "u",
  "i": "v",
  "j": "w",
  "k": "x",
  "l": "y",
  "m": "z",
  "n": "a",
  "o": "b",
  "p": "c",
  "q": "d",
  "r": "e",
  "s": "f",
  "t": "g",
  "u": "h",
  "v": "i",
  "w": "j",
  "x": "k",
  "y": "l",
  "z": "m"
}

const NUMBERS = {
  "0": "5",
  "1": "6",
  "2": "7",
  "3": "8",
  "4": "9",
  "5": "0",
  "6": "1",
  "7": "2",
  "8": "3",
  "9": "4"
}

/* switches between code form and message form */
function switchCodeAndMessage(content) {
  const characters = content.split("");
  let switchedContent = "";
  let nextLetter;
  for (let i = 0; i < characters.length; i++) {
    currChar = characters[i].toLowerCase();
    if (currChar in ALPHABET) {
      nextLetter = ALPHABET[currChar];
      // ensure character is the correct case
      if (currChar !== characters[i]) {
        nextLetter = nextLetter.toUpperCase();
      }
    }
    else if (currChar in NUMBERS) {
      nextLetter = NUMBERS[currChar];
    }
    else {
      nextLetter = currChar;
    }
    switchedContent += nextLetter;
  }
  return switchedContent;
}

function updateTo(e) {
  let to = e.target.value;
  toForURL = encodeURIComponent(switchCodeAndMessage(to))
    .replace(/\(/g, "%28").replace(/\)/g, "%29")
    .replace(/\!/g, "%21").replace(/\'/g, "%27")
    .replace(/\./g, "%2E").replace(/\*/g, "%2A");
  updateURLToCopy();
}

function updateFrom(e) {
  const from = e.target.value;
  fromForURL = encodeURIComponent(switchCodeAndMessage(from))
    .replace(/\(/g, "%28").replace(/\)/g, "%29")
    .replace(/\!/g, "%21").replace(/\'/g, "%27")
    .replace(/\./g, "%2E").replace(/\*/g, "%2A");
  updateURLToCopy();
}

function updateURLToCopy() {
  const urlToCopy = document.getElementById("link-to-copy");
  let tempURL = BASE_URL;
  if (toForURL) {
    tempURL = tempURL + "t=" + toForURL;
  }
  if (fromForURL) {
    tempURL = tempURL + "&f=" + fromForURL;
  }
  urlToCopy.value = tempURL;
  revertCopyButton();
}

function copyToClipboard() {
  const urlToCopy = document.getElementById("link-to-copy");
  urlToCopy.select();
  urlToCopy.setSelectionRange(0, 99999); // for mobile
  document.execCommand('copy');
  // show success message
  updateCopyButtonToCopied();
}

function updateCopyButtonToCopied() {
  const copyButton = document.getElementById("copy-button");
  copyButton.innerText = "copied!";
}

function revertCopyButton() {
  const copyButton = document.getElementById("copy-button");
  copyButton.innerText = "copy";
}

function openMainContent(e) {
  const response = e.target.innerText;
  const title = document.getElementById("title");
  if (response === "no") {
    title.innerText = "nice!! keep it that way:\n here's ANOTHER tab you can close!!";

  }
  document.getElementById("question").style.display = "none";
  document.getElementById("post-landing").style.display = "block";
}

function openShareDialog() {
  document.getElementById("post-landing").style.display = "none";
  document.getElementById("create-link-box").style.display = "block";
}

function closeShareDialog() {
  document.getElementById("post-landing").style.display = "block";
  document.getElementById("create-link-box").style.display = "none";
}

window.onload = function() {
  const yesButton = document.getElementById("yes");
  yesButton.addEventListener("click", openMainContent);
  const noButton = document.getElementById("no");
  noButton.addEventListener("click", openMainContent);
  const toInput= document.getElementById("to-input");
  const fromInput = document.getElementById("from-input");
  toInput.addEventListener("input", updateTo);
  fromInput.addEventListener("input", updateFrom);
  const copyButton = document.getElementById("copy-button");
  copyButton.addEventListener("click", copyToClipboard);
  const openShareButton = document.getElementById("open-share-box");
  openShareButton.addEventListener("click", openShareDialog);
  const closeShareButton = document.getElementById("close-share-button");
  closeShareButton.addEventListener("click", closeShareDialog);
  // decode message if applicable
  const queryString = window.location.search;
  const param = new URLSearchParams(queryString);
  const to = param.get('t');
  const from = param.get('f');
  if (to) {
    let decodedTo = switchCodeAndMessage(decodeURIComponent(to));
    const customTo = document.getElementById("to-name");
    customTo.innerText = decodedTo;
  }
  if (from) {
    let decodedFrom = switchCodeAndMessage(decodeURIComponent(from));
    const customFrom = document.getElementById("from-name");
    customFrom.innerText = decodedFrom;
  }
}