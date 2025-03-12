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

    document.getElementById("template-container").style.display = "none";
    document.getElementById("template-headline").style.display = "none";
    document.getElementById("setup-container").style.display = "none";
    document.getElementById("video-container").style.display = "block";

    // Verstecke die Liste
    document.querySelector('.container-list').style.display = 'none';

    getRandomPair();
}

function getRandomPair() {
    if (videos.length === 1) {
        document.getElementById("video-container").innerHTML = `
        <div class="iframe-container">
            <iframe width='560' height='315' src='https://www.youtube.com/embed/${videos[0]}' allowfullscreen></iframe>
        </div>
      `;
        return;
    }
    let shuffled = videos.sort(() => 0.5 - Math.random());
    let [video1, video2] = shuffled.slice(0, 2);
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