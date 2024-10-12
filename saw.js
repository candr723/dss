<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Additive Weighting</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="topnav" id="myTopnav">
        <p class="logo">Novice</p>
        <div class="menu">
            <a href="index.html">Home</a>
            <div class="dropdown">
              <button class="dropbtn">
                Methods
                <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                  <a href="saw.html">SAW</a>
                  <a href="wp.html">WP</a>
                  <a href="topsis.html">TOPSIS</a>
                  <a href="ahp.html">AHP</a>
              </div>
            </div>
            <a href="#about">About</a>
            <a
              href="javascript:void(0);"
              style="font-size: 15px"
              class="icon"
              onclick="myFunction()"
              >&#9776;
            </a>
        </div>
    </div>
<h1>Simple Additive Weighting (SAW) Calculator</h1>

<form id="sawForm">
    <label for="criteria">Number of Criteria:</label>
    <input type="number" id="criteria" name="criteria" min="1" value="3"><br><br>
  
    <label for="alternatives">Number of Alternatives:</label>
    <input type="number" id="alternatives" name="alternatives" min="1" value="3"><br><br>
  
    <button class="form-button" type="button" onclick="generateTable()">Generate Table</button>
  </form>
  
  <div id="inputTable"></div>
  
  <div id="result"></div>
  

<script src="saw.js"></script>
    <script>
        function myFunction() {
          var x = document.getElementById("myTopnav");
          if (x.className === "topnav") {
            x.className += " responsive";
          } else {
            x.className = "topnav";
          }
        }
      </script>
</body>
</html>