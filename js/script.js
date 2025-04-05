let seed = null;
let seededRandom = Math.random;

function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function addTemplateVideos(videoIds) {
    videoIds.forEach(videoId => {
        if (!videos.includes(videoId)) {
            videos.push(videoId);
        }
    });
    updateVideoList();
}

let videos = [];

document.getElementById("video-url").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addVideo(event);
    }
});

function addVideo(event) {
    if (event.key === "Enter") {
        const inputField = document.getElementById("video-url");
        const url = inputField.value.trim();
        const videoId = extractVideoID(url);
        if (videoId && !videos.includes(videoId)) {
            videos.push(videoId);
            updateVideoList();
            inputField.value = "";
        }
    }
}

function extractVideoID(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)/);
    return match ? (match[1] || match[2]) : null;
}

function updateVideoList() {
    const listContainer = document.getElementById("video-list");
    listContainer.innerHTML = videos.map(video => {
        const videoUrl = `https://www.youtube.com/watch?v=${video}`;
        return `<li class='list-group-item'>${videoUrl}</li>`;
    }).join("\n");
}

function startRanking() {
    if (videos.length < 2) {
        alert("Bitte geben Sie mindestens zwei Videos ein.");
        return;
    }

    const seedInput = document.getElementById("seed-input").value.trim();

    if (seedInput !== "") {
        seed = hashString(seedInput);
        seededRandom = mulberry32(seed);
        showSeed(seedInput);
    } else {
        const randomSeed = Math.random().toString(36).substring(2, 15);
        seed = hashString(randomSeed);
        seededRandom = mulberry32(seed);
        showSeed(randomSeed);
    }

    document.getElementById("template-container").style.display = "none";
    document.getElementById("template-headline").style.display = "none";
    document.getElementById("setup-container").style.display = "none";
    document.getElementById("video-container").style.display = "block";
    document.querySelector('.container-list').style.display = 'none';

    getRandomPair();
}


function showSeed(value) {
    let seedDisplay = document.getElementById("seed-display");

    if (!seedDisplay) {
        seedDisplay = document.createElement("div");
        seedDisplay.id = "seed-display";
        seedDisplay.className = "alert alert-secondary mt-3";
        const mainContainer = document.getElementById("main-container");
        mainContainer.insertBefore(seedDisplay, mainContainer.firstChild);
    }

    seedDisplay.textContent = `Aktueller Seed: ${value}`;

    seedDisplay.classList.remove("d-none");
}

function getRandomPair() {
    if (videos.length === 1) {
        document.getElementById("video-container").innerHTML = `
        <div class="iframe-container">
            <iframe width='560' height='315' src='https://www.youtube.com/embed/${videos[0]}' allowfullscreen></iframe>
        </div>`;
        return;
    }

    let shuffled = [...videos];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const [video1, video2] = shuffled.slice(0, 2);
    displayVideos(video1, video2);
}

function displayVideos(video1, video2) {
    document.getElementById("video-container").innerHTML = `
      <div class='row'>
        <div class='col-md-6 text-center'>
          <iframe width='100%' height='315' src='https://www.youtube.com/embed/${video1}' allowfullscreen></iframe>
          <button class='btn btn-success mt-2' onclick='vote("${video1}", "${video2}")'>Vote</button>
        </div>
        <div class='col-md-6 text-center'>
          <iframe width='100%' height='315' src='https://www.youtube.com/embed/${video2}' allowfullscreen></iframe>
          <button class='btn btn-success mt-2' onclick='vote("${video2}", "${video1}")'>Vote</button>
        </div>
      </div>`;
}

function vote(winner, loser) {
    videos = videos.filter(video => video !== loser);
    getRandomPair();
}

window.onload = function() {
    document.getElementById("setup-container").style.display = "block";
    document.getElementById("video-container").style.display = "none";
};