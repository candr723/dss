function generateWPTable() {
    const criteria = document.getElementById('criteria').value;
    const alternatives = document.getElementById('alternatives').value;
    const weights = document.getElementById('weights').value.split(',').map(Number);
    const types = document.getElementById('types').value.split(',').map(type => type.trim());
  
    let tableHtml = '<table border="1"><tr><th>Alternatives</th>';
    
    // Generate table headers for criteria
    for (let i = 1; i <= criteria; i++) {
      tableHtml += `<th>Criterion ${i}</th>`;
    }
    tableHtml += '</tr>';
  
    // Generate table rows for alternatives
    for (let i = 1; i <= alternatives; i++) {
      tableHtml += `<tr><td>Alternative ${i}</td>`;
      for (let j = 1; j <= criteria; j++) {
        tableHtml += `<td><input type="number" id="a${i}c${j}" value="0" step="0.01"></td>`;
      }
      tableHtml += '</tr>';
    }
  
    tableHtml += '</table><br><button type="button" onclick="calculateWP()">Calculate WP</button>';
    document.getElementById('inputTable').innerHTML = tableHtml;
  }
  
  function calculateWP() {
    const criteria = document.getElementById('criteria').value;
    const alternatives = document.getElementById('alternatives').value;
    const weights = document.getElementById('weights').value.split(',').map(Number);
    const types = document.getElementById('types').value.split(',').map(type => type.trim());
  
    let results = [];
  
    // Loop through each alternative
    for (let i = 1; i <= alternatives; i++) {
      let product = 1;
  
      // Loop through each criterion
      for (let j = 1; j <= criteria; j++) {
        const value = parseFloat(document.getElementById(`a${i}c${j}`).value);
  
        // Adjust value based on Benefit/Cost
        let adjustedValue = types[j - 1] === 'Cost' ? 1 / value : value;
  
        // Multiply the weighted value
        product *= Math.pow(adjustedValue, weights[j - 1]);
      }
  
      // Push the final product (S vector) for this alternative
      results.push({ alternative: i, score: product });
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
    let resultHtml = '<h3>Results</h3><table border="1"><tr><th>Alternative</th><th>Normalized Score</th></tr>';
    results.forEach(result => {
      resultHtml += `<tr><td>Alternative ${result.alternative}</td><td>${result.score.toFixed(4)}</td></tr>`;
    });
    resultHtml += '</table>';
  
    document.getElementById('result').innerHTML = resultHtml;
  }
  