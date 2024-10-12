function generateWPTable() {
  const criteria = parseInt(document.getElementById('criteria').value);
  const alternatives = parseInt(document.getElementById('alternatives').value);
  
  let tableHTML = '<table border="1"><tr><th>Alternatives</th>';

  // Generate table headers for criteria, including weights and types (Cost/Benefit)
  for (let i = 1; i <= criteria; i++) {
      tableHTML += `
          <th>
              Criteria ${i}<br>
              Weight: <input type="number" id="weight${i}" min="0" max="1" step="0.01" value="0.3"><br>
              <input type="checkbox" id="c${i}type"> Cost
          </th>`;
  }
  tableHTML += '</tr>';

  // Generate table rows for alternatives with name input
  for (let j = 1; j <= alternatives; j++) {
      tableHTML += `<tr><td><input type="text" id="alt${j}" value="Alternative ${j}"></td>`;
      for (let k = 1; k <= criteria; k++) {
          tableHTML += `<td><input type="number" id="a${j}c${k}" min="0" step="0.01" value="0"></td>`;
      }
      tableHTML += '</tr>';
  }
  tableHTML += '</table><br><button type="button" onclick="calculateWP()" class="form-button-2">Calculate WP</button>';
  tableHTML += `<button type="button" onclick="resetTable()" class="form-button-2" style="background-color: red;">Reset</button>`;
  document.getElementById('inputTable').innerHTML = tableHTML;
}

function calculateWP() {
  const criteria = parseInt(document.getElementById('criteria').value);
  const alternatives = parseInt(document.getElementById('alternatives').value);
  
  let weights = [];
  let types = [];
  let totalWeight = 0;

  // Ambil bobot dan jenis kriteria (Cost/Benefit)
  for (let i = 1; i <= criteria; i++) {
      let weight = parseFloat(document.getElementById(`weight${i}`).value);
      totalWeight += weight;
      weights.push(weight);
      types.push(document.getElementById(`c${i}type`).checked ? "Cost" : "Benefit");
  }

  // Normalisasi bobot agar jumlah bobot = 1
  weights = weights.map(weight => weight / totalWeight);

  let results = [];

  // Loop through each alternative
  for (let j = 1; j <= alternatives; j++) {
      let product = 1;
      for (let k = 1; k <= criteria; k++) {
          const value = parseFloat(document.getElementById(`a${j}c${k}`).value);
          
          // Adjust value based on Benefit/Cost
          let adjustedValue = types[k - 1] === 'Cost' ? 1 / value : value;
          
          // Multiply the weighted value (normalized weight)
          product *= Math.pow(adjustedValue, weights[k - 1]);
      }
      results.push({ alternative: document.getElementById(`alt${j}`).value, score: product });
  }

  // Calculate total sum of all products (S vector sum)
  const totalS = results.reduce((sum, result) => sum + result.score, 0);

  // Normalize each alternative score by dividing with the total S
  results = results.map(result => {
      return {
          alternative: result.alternative,
          score: result.score / totalS
      };
  });

  // Sort results based on normalized score
  results.sort((a, b) => b.score - a.score);

  // Display results
  let resultHTML = '<h3>Results</h3><table border="1"><tr><th>Alternative</th><th>Normalized Score</th></tr>';
  results.forEach(result => {
      resultHTML += `<tr><td>${result.alternative}</td><td>${result.score.toFixed(4)}</td></tr>`;
  });
  resultHTML += '</table>';

  document.getElementById('result').innerHTML = resultHTML;
  document.getElementById("result").style.display = "flex";
}

function resetTable() {
  // Mengosongkan elemen yang menampilkan input table dan result
  document.getElementById("inputTable").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").style.display = "none";
}