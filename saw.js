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
    tableHTML += '</table><br><button onclick="calculateSAW()">Calculate SAW</button>';
    document.getElementById("inputTable").innerHTML = tableHTML;
}
function calculateSAW() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
    const weights = document.getElementById("weights").value.split(',').map(Number);
    const types = document.getElementById("types").value.split(',').map(type => type.trim());
    let matrix = [];
    for (let j = 1; j <= alternatives; j++) {
        let row = [];
        for (let k = 1; k <= criteria; k++) {
            row.push(parseFloat(document.getElementById(`a${j}c${k}`).value));
        }
        matrix.push(row);
    }
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
    let results = [];
    for (let j = 0; j < alternatives; j++) {
        let sum = 0;
        for (let k = 0; k < criteria; k++) {
            sum += normalizedMatrix[k][j] * weights[k];
        }
        results.push({ alternative: j + 1, score: sum });
    }
    results.sort((a, b) => b.score - a.score);
    let resultHTML = '<h3>Results</h3><table><tr><th>Alternative</th><th>Score</th></tr>';
    results.forEach(res => {
        resultHTML += `<tr><td>Alternative ${res.alternative}</td><td>${res.score.toFixed(2)}</td></tr>`;
    });
    resultHTML += '</table>';
    document.getElementById("result").innerHTML = resultHTML;
}