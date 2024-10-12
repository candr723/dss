function generateTable() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
    let tableHTML = '<table><tr><th>Alternatives</th>';
    
    // Tambahkan kolom untuk bobot dan kriteria, serta checkbox Cost/Benefit
    for (let i = 1; i <= criteria; i++) {
        tableHTML += `<th>Criteria ${i} <br>Weight: <input type="number" id="weight${i}" min="0" max="1" step="0.01" value="0.3"> <br><input type="checkbox" id="c${i}type"> Cost</th>`;
    }
    tableHTML += '</tr>';
    
    // Tambahkan input untuk nama alternatif dan nilai kriteria
    for (let j = 1; j <= alternatives; j++) {
        tableHTML += `<tr><td><input type="text" id="alt${j}" value="Alternative ${j}"></td>`;
        for (let k = 1; k <= criteria; k++) {
            tableHTML += `<td><input type="number" id="a${j}c${k}" min="0" max="100"></td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table><br><button class="form-button-2" onclick="calculateTOPSIS()">Calculate TOPSIS</button>';
    tableHTML += `<button type="button" onclick="resetTable()" class="form-button-2" style="background-color: red;">Reset</button>`;
    document.getElementById("inputTable").innerHTML = tableHTML;
}

function calculateTOPSIS() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
    
    // Ambil bobot per kriteria
    let weights = [];
    for (let i = 1; i <= criteria; i++) {
        weights.push(parseFloat(document.getElementById(`weight${i}`).value));
    }

    // Cek jenis kriteria (Cost atau Benefit) dari checkbox
    let types = [];
    for (let i = 1; i <= criteria; i++) {
        const isCost = document.getElementById(`c${i}type`).checked;
        types.push(isCost ? "Cost" : "Benefit");
    }
    
    // Ambil data alternatif dan nilai kriteria
    let matrix = [];
    let alternativeNames = [];
    for (let j = 1; j <= alternatives; j++) {
        let row = [];
        alternativeNames.push(document.getElementById(`alt${j}`).value); // Ambil nama alternatif
        for (let k = 1; k <= criteria; k++) {
            row.push(parseFloat(document.getElementById(`a${j}c${k}`).value));
        }
        matrix.push(row);
    }
    
    // Langkah 1: Normalisasi matriks
    let normalizedMatrix = [];
    for (let i = 0; i < criteria; i++) {
        let column = matrix.map(row => row[i]);
        let sumOfSquares = Math.sqrt(column.reduce((sum, val) => sum + val * val, 0));
        let normalizedColumn = column.map(val => val / sumOfSquares);
        normalizedMatrix.push(normalizedColumn);
    }
    
    // Langkah 2: Normalisasi terbobot (Weighted normalized matrix)
    let weightedMatrix = [];
    for (let i = 0; i < criteria; i++) {
        weightedMatrix.push(normalizedMatrix[i].map(val => val * weights[i]));
    }
    
    // Langkah 3: Tentukan solusi ideal positif (A+) dan negatif (A-)
    let idealPositive = [];
    let idealNegative = [];
    for (let i = 0; i < criteria; i++) {
        if (types[i].toLowerCase() === "benefit") {
            idealPositive.push(Math.max(...weightedMatrix[i]));
            idealNegative.push(Math.min(...weightedMatrix[i]));
        } else {
            idealPositive.push(Math.min(...weightedMatrix[i]));
            idealNegative.push(Math.max(...weightedMatrix[i]));
        }
    }

    // Langkah 4: Hitung jarak ke solusi ideal positif (D+) dan negatif (D-)
    let distancesPositive = [];
    let distancesNegative = [];
    for (let j = 0; j < alternatives; j++) {
        let dPositive = 0;
        let dNegative = 0;
        for (let k = 0; k < criteria; k++) {
            dPositive += Math.pow(weightedMatrix[k][j] - idealPositive[k], 2);
            dNegative += Math.pow(weightedMatrix[k][j] - idealNegative[k], 2);
        }
        distancesPositive.push(Math.sqrt(dPositive));
        distancesNegative.push(Math.sqrt(dNegative));
    }
    
    // Langkah 5: Hitung nilai preferensi untuk setiap alternatif
    let preferenceValues = [];
    for (let j = 0; j < alternatives; j++) {
        preferenceValues.push({
            alternative: alternativeNames[j],
            score: distancesNegative[j] / (distancesPositive[j] + distancesNegative[j])
        });
    }

    // Urutkan hasil berdasarkan skor tertinggi
    preferenceValues.sort((a, b) => b.score - a.score);
    let resultHTML = '<h3>Results</h3><table><tr><th>Alternative</th><th>Score</th></tr>';
    preferenceValues.forEach(res => {
        resultHTML += `<tr><td>${res.alternative}</td><td>${res.score.toFixed(2)}</td></tr>`;
    });
    resultHTML += '</table>';
    document.getElementById("result").innerHTML = resultHTML;
    document.getElementById("result").style.display = "flex";
}

function resetTable() {
  // Mengosongkan elemen yang menampilkan input table dan result
  document.getElementById("inputTable").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").style.display = "none";
}