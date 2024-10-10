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
            if (criteria < 2) {
                alert("Jumlah kriteria minimal 2");
                return;
            }

            let table = "<h3>Input Matriks Perbandingan Berpasangan</h3>";
            table += "<table><tr><th>Kriteria</th>";

            // Header tabel kriteria
            for (let i = 0; i < criteria; i++) {
                table += `<th>K${i+1}</th>`;
            }
            table += "</tr>";

            // Matriks input
            for (let i = 0; i < criteria; i++) {
                table += `<tr><td>K${i+1}</td>`;
                for (let j = 0; j < criteria; j++) {
                    if (i === j) {
                        // Diagonal matriks, selalu 1
                        table += `<td><input type="number" id="crit${i}${j}" value="1" readonly></td>`;
                    } else {
                        table += `<td><input type="number" id="crit${i}${j}" value="1" step="0.1"></td>`;
                    }
                }
                table += "</tr>";
            }
            table += "</table>";
            table += `<button type="button" onclick="calculateAHP(${criteria})">Hitung AHP</button>`;

            document.getElementById("inputTable").innerHTML = table;
        }

        function calculateAHP(criteria) {
            let matrix = [];

            // Mengambil nilai dari matriks input
            for (let i = 0; i < criteria; i++) {
                matrix[i] = [];
                for (let j = 0; j < criteria; j++) {
                    matrix[i][j] = parseFloat(document.getElementById(`crit${i}${j}`).value);
                    if (isNaN(matrix[i][j])) {
                        alert(`Input tidak valid pada K${i+1}, K${j+1}`);
                        return;
                    }
                }
            }

            console.log("Matriks Perbandingan Berpasangan:", matrix);

            // Step 1: Normalisasi matriks
            let normalizedMatrix = normalizeMatrix(matrix, criteria);
            console.log("Matriks Ter-normalisasi:", normalizedMatrix);

            // Step 2: Menghitung bobot prioritas
            let weights = calculateWeights(normalizedMatrix, criteria);
            console.log("Bobot Kriteria:", weights);

            // Step 3: Hitung Consistency Ratio
            let consistencyRatio = calculateConsistency(matrix, weights, criteria);
            console.log("Consistency Ratio:", consistencyRatio);

            // Tampilkan hasil
            let result = "<h3>Hasil AHP</h3><table border='1'><tr><th>Kriteria</th><th>Bobot</th></tr>";
            let bestCriteriaIndex = 0;
            let highestWeight = weights[0];

            for (let i = 0; i < criteria; i++) {
                result += `<tr><td>K${i+1}</td><td>${weights[i].toFixed(4)}</td></tr>`;
                // Memilih kriteria terbaik berdasarkan bobot tertinggi
                if (weights[i] > highestWeight) {
                    highestWeight = weights[i];
                    bestCriteriaIndex = i;
                }
            }
            result += "</table>";

            result += `<p><strong>Consistency Ratio (CR):</strong> ${consistencyRatio.toFixed(4)}</p>`;
            if (consistencyRatio > 0.1) {
                result += "<p><span style='color: red;'>CR lebih dari 0.1, matriks tidak konsisten.</span></p>";
            } else {
                result += "<p><span style='color: green;'>CR kurang dari 0.1, matriks konsisten.</span></p>";
            }

            // Menampilkan kriteria terbaik
            result += `<h3>Kriteria Terbaik</h3>`;
            result += `<p>Kriteria terbaik adalah <strong>K${bestCriteriaIndex + 1}</strong> dengan bobot ${highestWeight.toFixed(4)}</p>`;

            document.getElementById("result").innerHTML = result;
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
            const randomIndex = [0.00, 0.00, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45]; // Nilai RI untuk matriks 1 hingga 9
            let consistencyRatio = consistencyIndex / randomIndex[criteria - 1];

            return consistencyRatio;
        }
