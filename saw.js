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
    tableHTML += '</table><br><button onclick="calculateSAW()">Calculate SAW</button>';
    document.getElementById("inputTable").innerHTML = tableHTML;
}

function calculateSAW() {
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
    
    // Normalisasi matriks
    let normalizedMatrix = [];
    for (let i = 0; i < criteria; i++) {
        let column = matrix.map(row => row[i]);
        let normalizedColumn;
        if (types[i].toLowerCase() === "benefit") {
            let max = Math.max(...column);
            normalizedColumn = column.map(val => val / max);
        } else if (types[i].toLowerCase() === "cost") {
            let min = Math.min(...column);
            normalizedColumn = column.map(val => min / val);
        }
        normalizedMatrix.push(normalizedColumn);
    }
    
    // Hitung hasil
    let results = [];
    for (let j = 0; j < alternatives; j++) {
        let sum = 0;
        for (let k = 0; k < criteria; k++) {
            sum += normalizedMatrix[k][j] * weights[k];
        }
        results.push({ alternative: alternativeNames[j], score: sum });
    }
    
    // Urutkan berdasarkan skor tertinggi
    results.sort((a, b) => b.score - a.score);
    let resultHTML = '<h3>Results</h3><table><tr><th>Alternative</th><th>Score</th></tr>';
    results.forEach(res => {
        resultHTML += `<tr><td>${res.alternative}</td><td>${res.score.toFixed(2)}</td></tr>`;
    });
    resultHTML += '</table>';
    document.getElementById("result").innerHTML = resultHTML;
}
