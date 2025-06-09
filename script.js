var papan2048;
var score = 0;
var baris = 4;
var kolom = 4;

window.onload = function () {
    AturGame();
};

function AturGame() {
    papan2048 = [];
    for (let i = 0; i < baris; i++) {
        let row = [];
        for (let j = 0; j < kolom; j++) {
            row.push(0);
            let lantai = document.createElement("div");
            lantai.id = i + "-" + j;
            lantai.classList.add("lantai");
            document.getElementById("papan2048").append(lantai);
        }
        papan2048.push(row);
    }

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

function updatelantai(lantai, nomor) {
    lantai.innerText = "";
    lantai.className = "lantai"; 

    if (nomor > 0) {
        lantai.innerText = nomor;
        let kelas = "lantai" + (nomor <= 8192 ? nomor : "8192");
        lantai.classList.add(kelas);
    }
}


document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        geserkiri();
        AturGame2();
    } else if (e.code == "ArrowRight") {
        geserkanan();
        AturGame2();
    } else if (e.code == "ArrowUp") {
        geseratas();
        AturGame2();
    } else if (e.code == "ArrowDown") {
        geserbawah();
        AturGame2();
    }
});

function kecualinol(baris) {
    return baris.filter(nomor => nomor != 0);
}

function geser(baris) {
    baris = kecualinol(baris);

    for (let i = 0; i < baris.length - 1; i++) {
        if (baris[i] == baris[i + 1]) {
            baris[i] *= 2;
            baris[i + 1] = 0;
            score += baris[i];
        }
    }

    baris = kecualinol(baris);
    while (baris.length < kolom) {
        baris.push(0);
    }

    return baris;
}

function geserkiri() {
    for (let i = 0; i < baris; i++) {
        let row = papan2048[i];
        row = geser(row);
        papan2048[i] = row;

        for (let j = 0; j < kolom; j++) {
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
}

function geserkanan() {
    for (let i = 0; i < baris; i++) {
        let row = papan2048[i].slice().reverse();
        row = geser(row);
        row.reverse();
        papan2048[i] = row;

        for (let j = 0; j < kolom; j++) {
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
}

function geseratas() {
    for (let j = 0; j < kolom; j++) {
        let kol = [];
        for (let i = 0; i < baris; i++) {
            kol.push(papan2048[i][j]);
        }

        kol = geser(kol);

        for (let i = 0; i < baris; i++) {
            papan2048[i][j] = kol[i];
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
}

function geserbawah() {
    for (let j = 0; j < kolom; j++) {
        let kol = [];
        for (let i = 0; i < baris; i++) {
            kol.push(papan2048[i][j]);
        }

        kol.reverse();
        kol = geser(kol);
        kol.reverse();

        for (let i = 0; i < baris; i++) {
            papan2048[i][j] = kol[i];
            let lantai = document.getElementById(i + "-" + j);
            updatelantai(lantai, papan2048[i][j]);
        }
    }
}
