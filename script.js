var papan2048;
var score = 0;
var bestScore = localStorage.getItem("bestScore2048") ? parseInt(localStorage.getItem("bestScore2048")) : 0;
var baris = 4;
var kolom = 4;
var gameOver = false;
var touchStartX = 0;
var touchStartY = 0;

function updateBestScore() {
    document.getElementById("bestScore").innerText = bestScore;
    localStorage.setItem("bestScore2048", bestScore);
}

function resetGame() {
    AturGame();
}

function closeGameOverModal() {
    document.getElementById("gameOverModal").classList.add("hidden");
}

function showGameOverModal() {
    var modal = document.getElementById("gameOverModal");
    document.getElementById("gameOverScore").innerText = "Final Score: " + score;
    modal.classList.remove("hidden");
}

window.onload = function () {
    updateBestScore();
    AturGame();
    setupEventListeners();
};

function setupEventListeners() {
    document.getElementById("newGameBtn").addEventListener("click", function () {
        resetGame();
    });

    document.getElementById("restartBtn").addEventListener("click", function () {
        closeGameOverModal();
        resetGame();
    });

    // Swipe gesture support
    document.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener("touchend", function (e) {
        var touchEndX = e.changedTouches[0].screenX;
        var touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, false);
}

function handleSwipe(startX, startY, endX, endY) {
    if (gameOver) return;

    var diffX = startX - endX;
    var diffY = startY - endY;
    var minDistance = 50;
    var moved = false;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > minDistance) {
            moved = geserkiri();
        } else if (diffX < -minDistance) {
            moved = geserkanan();
        }
    } else {
        if (diffY > minDistance) {
            moved = geseratas();
        } else if (diffY < -minDistance) {
            moved = geserbawah();
        }
    }

    if (moved) {
        AturGame2();
        updateScore();
        cekGameOver();
    }
}

function AturGame() {
    papan2048 = [];
    var container = document.getElementById("papan2048");
    container.innerHTML = "";

    for (let i = 0; i < baris; i++) {
        let row = [];
        for (let j = 0; j < kolom; j++) {
            row.push(0);
            let lantai = document.createElement("div");
            lantai.id = i + "-" + j;
            lantai.classList.add("lantai");
            container.append(lantai);
        }
        papan2048.push(row);
    }

    gameOver = false;
    score = 0;
    updateScore();
    AturGame2();
    AturGame2();
}

function AturGame2() {
    if (!AdaLantaiKosong()) return;

    let found = false;
    while (!found) {
        let i = Math.floor(Math.random() * baris);
        let j = Math.floor(Math.random() * kolom);
        if (papan2048[i][j] === 0) {
            papan2048[i][j] = 2;
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, 2);
            lantai.classList.add("new");
            found = true;
        }
    }
}

function AdaLantaiKosong() {
    for (let i = 0; i < baris; i++) {
        for (let j = 0; j < kolom; j++) {
            if (papan2048[i][j] === 0) return true;
        }
    }
    return false;
}

function canMove() {
    // Check if any moves are possible
    if (AdaLantaiKosong()) return true;

    // Check for possible merges
    for (let i = 0; i < baris; i++) {
        for (let j = 0; j < kolom; j++) {
            let tile = papan2048[i][j];

            // Check right
            if (j < kolom - 1 && tile === papan2048[i][j + 1]) return true;

            // Check down
            if (i < baris - 1 && tile === papan2048[i + 1][j]) return true;
        }
    }

    return false;
}

function cekGameOver() {
    if (!canMove()) {
        gameOver = true;
        showGameOverModal();
    }
}

function updatelantai(lantai, nomor) {
    var oldClass = lantai.className;
    lantai.innerText = "";
    lantai.className = "lantai";

    if (nomor > 0) {
        lantai.innerText = nomor;
        let kelas = "lantai" + (nomor <= 8192 ? nomor : "8192");
        lantai.classList.add(kelas);

        // Remove animation classes and re-trigger animation
        lantai.classList.remove("new", "merge");
        // Trigger reflow to restart animation
        void lantai.offsetWidth;
    }
}

function updateScore() {
    document.getElementById("score").innerText = score;
    if (score > bestScore) {
        bestScore = score;
        updateBestScore();
    }
}

document.addEventListener("keyup", (e) => {
    if (gameOver) return;

    var moved = false;
    if (e.code === "ArrowLeft") {
        moved = geserkiri();
    } else if (e.code === "ArrowRight") {
        moved = geserkanan();
    } else if (e.code === "ArrowUp") {
        moved = geseratas();
    } else if (e.code === "ArrowDown") {
        moved = geserbawah();
    }

    if (moved) {
        AturGame2();
        updateScore();
        cekGameOver();
    }
});

function kecualinol(baris) {
    return baris.filter((nomor) => nomor !== 0);
}

function geser(baris) {
    var merged = [];
    baris = kecualinol(baris);

    for (let i = 0; i < baris.length - 1; i++) {
        if (baris[i] === baris[i + 1]) {
            baris[i] *= 2;
            baris[i + 1] = 0;
            score += baris[i];
            merged.push(i);
        }
    }

    baris = kecualinol(baris);
    while (baris.length < kolom) {
        baris.push(0);
    }

    return { board: baris, merged: merged };
}

function geserkiri() {
    var moved = false;
    for (let i = 0; i < baris; i++) {
        let row = papan2048[i];
        let originalRow = row.slice();
        let result = geser(row);
        papan2048[i] = result.board;

        if (JSON.stringify(originalRow) !== JSON.stringify(result.board)) {
            moved = true;
        }

        for (let j = 0; j < kolom; j++) {
            let lantai = document.getElementById(i + "-" + j);
            if (result.merged.includes(j)) {
                lantai.classList.add("merge");
            }
            updatelantai(lantai, papan2048[i][j]);
        }
    }
    return moved;
}

function geserkanan() {
    var moved = false;
    for (let i = 0; i < baris; i++) {
        let row = papan2048[i].slice().reverse();
        let originalRow = row.slice();
        let result = geser(row);
        result.board.reverse();
        papan2048[i] = result.board;

        if (JSON.stringify(originalRow) !== JSON.stringify(result.board)) {
            moved = true;
        }

        for (let j = 0; j < kolom; j++) {
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
    return moved;
}

function geseratas() {
    var moved = false;
    for (let j = 0; j < kolom; j++) {
        let kol = [];
        for (let i = 0; i < baris; i++) {
            kol.push(papan2048[i][j]);
        }
        let originalCol = kol.slice();
        let result = geser(kol);
        kol = result.board;

        if (JSON.stringify(originalCol) !== JSON.stringify(kol)) {
            moved = true;
        }

        for (let i = 0; i < baris; i++) {
            papan2048[i][j] = kol[i];
            let lantai = document.getElementById(i + "-" + j);
            if (result.merged.includes(i)) {
                lantai.classList.add("merge");
            }
            updatelantai(lantai, papan2048[i][j]);
        }
    }
    return moved;
}

function geserbawah() {
    var moved = false;
    for (let j = 0; j < kolom; j++) {
        let kol = [];
        for (let i = 0; i < baris; i++) {
            kol.push(papan2048[i][j]);
        }
        let originalCol = kol.slice();

        kol.reverse();
        let result = geser(kol);
        kol = result.board;
        kol.reverse();

        if (JSON.stringify(originalCol) !== JSON.stringify(kol)) {
            moved = true;
        }

        for (let i = 0; i < baris; i++) {
            papan2048[i][j] = kol[i];
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
    return moved;
}
