function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function generateAHPTable() {
    const criteria = parseInt(document.getElementById("criteria").value);
    const alternatives = parseInt(document.getElementById("alternatives").value);
  
    if (criteria < 2 || alternatives < 2) {
      alert("Jumlah kriteria dan alternatif minimal 2");
      return;
    }
  
    let table = "<h3>Input Matriks Perbandingan Berpasangan untuk Kriteria</h3>";
    table += "<table><tr><th>Kriteria</th>";
  
    // Header tabel kriteria
    for (let i = 0; i < criteria; i++) {
      table += `<th>K${i + 1}</th>`;
    }
    table += "</tr>";
  
    // Matriks input untuk kriteria
    for (let i = 0; i < criteria; i++) {
      table += `<tr><td>K${i + 1}</td>`;
      for (let j = 0; j < criteria; j++) {
        if (i === j) {
          table += `<td><input type="number" id="crit${i}${j}" value="1" readonly></td>`;
        } else {
          table += `<td><input type="number" id="crit${i}${j}" value="1" step="0.1"></td>`;
        }
      }
      table += "</tr>";
    }
    table += "</table>";
  
    // Matriks perbandingan antar alternatif untuk setiap kriteria
    for (let k = 0; k < criteria; k++) {
      table += `<h3>Input Matriks Perbandingan Berpasangan untuk Kriteria K${k + 1}</h3>`;
      table += "<table><tr><th>Alternatif</th>";
  
      // Header tabel alternatif
      for (let i = 0; i < alternatives; i++) {
        table += `<th>A${i + 1}</th>`;
      }
      table += "</tr>";
  
      // Matriks input untuk alternatif
      for (let i = 0; i < alternatives; i++) {
        table += `<tr><td>A${i + 1}</td>`;
        for (let j = 0; j < alternatives; j++) {
          if (i === j) {
            table += `<td><input type="number" id="alt${k}${i}${j}" value="1" readonly></td>`;
          } else {
            table += `<td><input type="number" id="alt${k}${i}${j}" value="1" step="0.1"></td>`;
          }
        }
        table += "</tr>";
      }
      table += "</table>";
    }
  
    table += `<button type="button" onclick="calculateAHP(${criteria}, ${alternatives})" class="form-button-2">Hitung AHP</button>`;
    table += `<button type="button" onclick="resetTable()" class="form-button-2" style="background-color: red;">Reset</button>`;
  
    document.getElementById("inputTable").innerHTML = table;
  }
  

  function calculateAHP(criteria, alternatives) {
    let matrix = [];
  
    // Ambil nilai matriks kriteria
    for (let i = 0; i < criteria; i++) {
      matrix[i] = [];
      for (let j = 0; j < criteria; j++) {
        matrix[i][j] = parseFloat(document.getElementById(`crit${i}${j}`).value);
        if (isNaN(matrix[i][j])) {
          alert(`Input tidak valid pada K${i + 1}, K${j + 1}`);
          return;
        }
      }
    }
  
    // Normalisasi matriks kriteria dan hitung bobot
    let normalizedMatrix = normalizeMatrix(matrix, criteria);
    let weights = calculateWeights(normalizedMatrix, criteria);
  
    // Matriks alternatif berdasarkan tiap kriteria
    let alternativeScores = [];
    for (let k = 0; k < criteria; k++) {
      let altMatrix = [];
  
      for (let i = 0; i < alternatives; i++) {
        altMatrix[i] = [];
        for (let j = 0; j < alternatives; j++) {
          altMatrix[i][j] = parseFloat(document.getElementById(`alt${k}${i}${j}`).value);
        }
      }
  
      // Normalisasi matriks alternatif
      let normalizedAltMatrix = normalizeMatrix(altMatrix, alternatives);
      let altWeights = calculateWeights(normalizedAltMatrix, alternatives);
  
      alternativeScores[k] = altWeights;
    }
  
    // Menghitung total skor alternatif
    let finalScores = new Array(alternatives).fill(0);
    for (let i = 0; i < alternatives; i++) {
      for (let j = 0; j < criteria; j++) {
        finalScores[i] += alternativeScores[j][i] * weights[j];
      }
    }
  
    // Cari alternatif terbaik
    let bestAltIndex = 0;
    let bestScore = finalScores[0];
    for (let i = 1; i < alternatives; i++) {
      if (finalScores[i] > bestScore) {
        bestScore = finalScores[i];
        bestAltIndex = i;
      }
    }
  
    // Tampilkan hasil
    let result = "<h3>Hasil AHP</h3><table border='1'><tr><th>Alternatif</th><th>Skor</th></tr>";
    for (let i = 0; i < alternatives; i++) {
      result += `<tr><td>A${i + 1}</td><td>${finalScores[i].toFixed(4)}</td></tr>`;
    }
    result += "</table>";
  
    result += `<h3>Alternatif Terbaik</h3>`;
    result += `<p>Alternatif terbaik adalah <strong>A${bestAltIndex + 1}</strong> dengan skor ${bestScore.toFixed(4)}</p>`;
  
    document.getElementById("result").innerHTML = result;
    document.getElementById("result").style.display = "flex";
  }
  

function normalizeMatrix(matrix, criteria) {
  let colSums = [];
  let normalizedMatrix = [];

  // Hitung jumlah setiap kolom
  for (let j = 0; j < criteria; j++) {
    let sum = 0;
    for (let i = 0; i < criteria; i++) {
      sum += matrix[i][j];
    }
    colSums[j] = sum;
  }

  // Bagi setiap elemen dengan jumlah kolom untuk normalisasi
  for (let i = 0; i < criteria; i++) {
    normalizedMatrix[i] = [];
    for (let j = 0; j < criteria; j++) {
      normalizedMatrix[i][j] = matrix[i][j] / colSums[j];
    }
  }

  return normalizedMatrix;
}

function calculateWeights(normalizedMatrix, criteria) {
  let weights = [];

  // Menghitung rata-rata dari setiap baris
  for (let i = 0; i < criteria; i++) {
    let sum = 0;
    for (let j = 0; j < criteria; j++) {
      sum += normalizedMatrix[i][j];
    }
    weights[i] = sum / criteria;
  }

  return weights;
}

function calculateConsistency(matrix, weights, criteria) {
  // Step 1: Hitung matrix lambda max
  let lambdaMax = 0;
  for (let i = 0; i < criteria; i++) {
    let rowSum = 0;
    for (let j = 0; j < criteria; j++) {
      rowSum += matrix[i][j] * weights[j];
    }
    lambdaMax += rowSum / weights[i];
  }
  lambdaMax /= criteria;

  // Step 2: Hitung Consistency Index (CI)
  let consistencyIndex = (lambdaMax - criteria) / (criteria - 1);

  // Step 3: Hitung Consistency Ratio (CR)
  const randomIndex = [0.0, 0.0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45]; // Nilai RI untuk matriks 1 hingga 9
  let consistencyRatio = consistencyIndex / randomIndex[criteria - 1];

  return consistencyRatio;
}

function resetTable() {
  // Mengosongkan elemen yang menampilkan input table dan result
  document.getElementById("inputTable").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").style.display = "none";
}