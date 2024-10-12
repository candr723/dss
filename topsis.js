function generateTable() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
    let tableHTML = '<table><tr><th>Alternatives</th>';
    for (let i = 1; i <= criteria; i++) {
        tableHTML += `<th>Criteria ${i}</th>`;
    }
    tableHTML += '</tr>';
    for (let j = 1; j <= alternatives; j++) {
        tableHTML += `<tr><td>Alternative ${j}</td>`;
        for (let k = 1; k <= criteria; k++) {
            tableHTML += `<td><input type="number" id="a${j}c${k}" min="0" max="100"></td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table><br><button onclick="calculateTOPSIS()">Calculate TOPSIS</button>';
    document.getElementById("inputTable").innerHTML = tableHTML;
}

function calculateTOPSIS() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
    const weights = document.getElementById("weights").value.split(',').map(Number);
    const types = document.getElementById("types").value.split(',').map(type => type.trim());

    // Step 1: Build decision matrix
    let matrix = [];
    for (let j = 1; j <= alternatives; j++) {
        let row = [];
        for (let k = 1; k <= criteria; k++) {
            row.push(parseFloat(document.getElementById(`a${j}c${k}`).value));
        }
        matrix.push(row);
    }

    // Step 2: Normalize decision matrix
    let normalizedMatrix = [];
    for (let i = 0; i < criteria; i++) {
        let column = matrix.map(row => row[i]);
        let sumSquare = column.reduce((sum, val) => sum + val * val, 0);
        let normalizedColumn = column.map(val => val / Math.sqrt(sumSquare));
        normalizedMatrix.push(normalizedColumn);
    }

    // Step 3: Weighted normalized decision matrix
    let weightedMatrix = normalizedMatrix.map((col, i) => col.map(val => val * weights[i]));

    // Step 4: Determine ideal and negative-ideal solutions
    let idealPositive = [];
    let idealNegative = [];
    for (let i = 0; i < criteria; i++) {
        if (types[i].toLowerCase() === "benefit") {
            idealPositive.push(Math.max(...weightedMatrix[i]));
            idealNegative.push(Math.min(...weightedMatrix[i]));
        } else if (types[i].toLowerCase() === "cost") {
            idealPositive.push(Math.min(...weightedMatrix[i]));
            idealNegative.push(Math.max(...weightedMatrix[i]));
        }
    }

    // Step 5: Calculate distance to ideal and negative-ideal solutions
    let distancesPositive = [];
    let distancesNegative = [];
    for (let j = 0; j < alternatives; j++) {
        let distancePositive = 0;
        let distanceNegative = 0;
        for (let k = 0; k < criteria; k++) {
            distancePositive += Math.pow(weightedMatrix[k][j] - idealPositive[k], 2);
            distanceNegative += Math.pow(weightedMatrix[k][j] - idealNegative[k], 2);
        }
        distancesPositive.push(Math.sqrt(distancePositive));
        distancesNegative.push(Math.sqrt(distanceNegative));
    }

    // Step 6: Calculate preference scores
    let results = [];
    for (let j = 0; j < alternatives; j++) {
        let score = distancesNegative[j] / (distancesPositive[j] + distancesNegative[j]);
        results.push({ alternative: j + 1, score: score });
    }

    // Step 7: Rank alternatives based on scores
    results.sort((a, b) => b.score - a.score);
    let resultHTML = '<h3>Results</h3><table><tr><th>Alternative</th><th>Score</th></tr>';
    results.forEach(res => {
        resultHTML += `<tr><td>Alternative ${res.alternative}</td><td>${res.score.toFixed(2)}</td></tr>`;
    });
    resultHTML += '</table>';
    document.getElementById("result").innerHTML = resultHTML;
}
