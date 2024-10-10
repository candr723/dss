function generateTopsisTable() {
    const criteria = document.getElementById("criteria").value;
    const alternatives = document.getElementById("alternatives").value;
    const weights = document.getElementById("weights").value.split(",").map(Number);
    const types = document.getElementById("types").value.split(",");

    let inputTable = "<h3>Input Table</h3>";
    inputTable += "<table border='1'><tr><th>Alternative</th>";

    // Generate table headers for criteria
    for (let i = 0; i < criteria; i++) {
        inputTable += `<th>Criterion ${i+1}</th>`;
    }
    inputTable += "</tr>";

    // Generate input rows for each alternative
    for (let i = 0; i < alternatives; i++) {
        inputTable += `<tr><td>Alternative ${i+1}</td>`;
        for (let j = 0; j < criteria; j++) {
            inputTable += `<td><input type="number" id="alt${i}crit${j}" value="0"></td>`;
        }
        inputTable += "</tr>";
    }
    inputTable += "</table>";
    inputTable += `<button type="button" onclick="calculateTopsis(${criteria}, ${alternatives}, ${JSON.stringify(weights)}, ${JSON.stringify(types)})">Calculate TOPSIS</button>`;
    
    document.getElementById("inputTable").innerHTML = inputTable;
}

function calculateTopsis(criteria, alternatives, weights, types) {
    weights = JSON.parse(weights);
    types = JSON.parse(types);
    
    let matrix = [];

    // Collect input values into matrix
    for (let i = 0; i < alternatives; i++) {
        matrix[i] = [];
        for (let j = 0; j < criteria; j++) {
            matrix[i][j] = parseFloat(document.getElementById(`alt${i}crit${j}`).value);
        }
    }

    console.log("Matrix:", matrix); // Debugging

    // Step 1: Normalize the decision matrix
    let normMatrix = normalizeMatrix(matrix, criteria, alternatives);
    console.log("Normalized Matrix:", normMatrix); // Debugging

    // Step 2: Weight the normalized matrix
    let weightedMatrix = weightMatrix(normMatrix, weights, criteria, alternatives);
    console.log("Weighted Matrix:", weightedMatrix); // Debugging

    // Step 3: Determine ideal best and worst values
    let idealBest = [], idealWorst = [];
    for (let j = 0; j < criteria; j++) {
        if (types[j].trim().toLowerCase() === "benefit") {
            idealBest[j] = Math.max(...weightedMatrix.map(row => row[j]));
            idealWorst[j] = Math.min(...weightedMatrix.map(row => row[j]));
        } else {
            idealBest[j] = Math.min(...weightedMatrix.map(row => row[j]));
            idealWorst[j] = Math.max(...weightedMatrix.map(row => row[j]));
        }
    }
    console.log("Ideal Best:", idealBest); // Debugging
    console.log("Ideal Worst:", idealWorst); // Debugging

    // Step 4: Calculate the separation measures
    let separationBest = [], separationWorst = [];
    for (let i = 0; i < alternatives; i++) {
        separationBest[i] = Math.sqrt(weightedMatrix[i].reduce((sum, val, j) => sum + Math.pow(val - idealBest[j], 2), 0));
        separationWorst[i] = Math.sqrt(weightedMatrix[i].reduce((sum, val, j) => sum + Math.pow(val - idealWorst[j], 2), 0));
    }
    console.log("Separation from Ideal Best:", separationBest); // Debugging
    console.log("Separation from Ideal Worst:", separationWorst); // Debugging

    // Step 5: Calculate the relative closeness to the ideal solution
    let closeness = separationWorst.map((dMinus, i) => dMinus / (dMinus + separationBest[i]));
    console.log("Closeness:", closeness); // Debugging

    // Step 6: Output the result
    let result = "<h3>TOPSIS Result</h3>";
    for (let i = 0; i < alternatives; i++) {
        result += `<p>Alternative ${i+1}: Closeness to Ideal Solution = ${closeness[i].toFixed(4)}</p>`;
    }
    
    document.getElementById("result").innerHTML = result;
}

    function myFunction() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
        x.className += " responsive";
        } else {
        x.className = "topnav";
        }
    }