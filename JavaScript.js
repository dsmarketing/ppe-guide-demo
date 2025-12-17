document.addEventListener("DOMContentLoaded", createTable);

function createTable() {
  document.getElementById("loading-bar").style.display = "flex";
  
  const totalDataPoints = 24310;
  // Set the chunk size (in increments)
  const chunkSize = 379;
  let currentProgress = 0;

// Simulate loading by updating the progress bar in chunks
    function updateProgress() {
      if (currentProgress < totalDataPoints) {
        currentProgress += chunkSize;  // Increase progress by chunk size (500)
        if (currentProgress > totalDataPoints) {
          currentProgress = totalDataPoints;  // Cap the progress to totalDataPoints
        }
        const progressPercentage = (currentProgress / totalDataPoints) * 100;
        document.getElementById("progress").style.width = `${progressPercentage}%`;
        document.getElementById("progress-text").textContent = `${currentProgress} / ${totalDataPoints}`;
      }
    }

    // Simulate progress bar update every 100ms (this is just visual)
    const progressInterval = setInterval(updateProgress, 100);

    // Stop the progress bar after it reaches 100% (or simulating end of loading)
    setTimeout(() => {
      clearInterval(progressInterval); // Stop the progress bar once it's done
      document.getElementById("loading-bar").style.display = "none";  // Hide the progress bar
    }, 11000);  // Simulate loading for 11 seconds (adjustable)

  fetch('https://script.google.com/macros/s/AKfycbzrnj05YY4q2grrvR5jyz_4tL6X6pq0Y32MUEzP9eOzxONzDWYkZZ9NzbzUIo9wmQ-v/exec') // Google Sheets JSON URL
    .then(response => response.json())
    .then(tableData => {
      let table = new Tabulator("#example-table", {
        data: tableData,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 50],
        paginationCounter: "rows",
		ajaxURL:"https://script.google.com/macros/s/AKfycbzrnj05YY4q2grrvR5jyz_4tL6X6pq0Y32MUEzP9eOzxONzDWYkZZ9NzbzUIo9wmQ-v/exec", //ajax URL
		progressiveLoad:"scroll", //sequentially load all data into the table
        movableColumns: true,
        responsiveLayout: "collapse",
        layout: "fitColumns",
        columnDefaults: { tooltip: true },
        columns: [
        { title: "", field: "Billede", formatter: "image", formatterParams: { height: "70px", width: "70px" }, width: 85, vertAlign: "center" },
        { title: "Kemikalie", field: "Kemikalie", headerFilter: true, width: 300, vertAlign: "center" },
        { title: "CAS nr.", field: "CAS nummer", headerFilter: true, vertAlign: "center" },
        { title: "Vare nr.", field: "Vare nummer", headerFilter: true, vertAlign: "center" },
        { title: "Produkt type", field: "Produkt type", headerFilter: true, vertAlign:"center"  },
        { title: "Produkt", field: "Produkt", headerFilter: true, vertAlign: "center" },
        { title: "Gennembrudstid", field: "Gennembrudstid", headerFilter: true, vertAlign: "center" },
        { title: "Index", field: "Index", headerFilter: true, width: 100, formatter: colorIndex, vertAlign: "center" },
        { title: "Link", field: "URL", formatter: "link", width: 82, formatterParams: { label: "Link", target: "_blank" } }
    ],
      });
	  
	  table.on("rowClick", function (e, row) {
      showPopup(row.getData());
    });

    // Add event listener for global search
      document.getElementById("global-search").addEventListener("keyup", function() {
        let searchTerm = this.value;
        table.setFilter((data) => {
          // Search all columns
          return Object.values(data).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });
	  

      document.getElementById("loading-bar").style.display = "none";
    })
    .catch(error => {
      console.error('Error loading data:', error);
      document.getElementById("loading-bar").style.display = "none";
    });
}

<!-- JavaScript to toggle modals -->
function toggleModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function showPopup(data) {
  let popup = document.getElementById("popup");

  // Create popup if it doesn't exist
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup";
    document.body.appendChild(popup);

    // Add basic styling
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #ccc";
    popup.style.zIndex = "1000";
    popup.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.5)";
  }

  // Update popup content
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Testresultat</h2>
      <p><strong>Kemikalie:</strong> ${data.Kemikalie}</p>
      <p><strong>CAS nummer:</strong> ${data["CAS nummer"]}</p>
      <p><strong>Vare nummer:</strong> ${data["Vare nummer"]}</p>
      <p><strong>Produkt type:</strong> ${data["Produkt type"]}</p>
      <p><strong>Produkt:</strong> 
        <a href="${data["URL"]}">
        ${data.Produkt}
        </a>
      </p>
      <p><strong>Gennembrudstid:</strong> ${data.Gennembrudstid}</p>
      <p><strong>Index:</strong> ${data.Index}</p>
      <button onclick="closePopup()">Luk</button>
    </div>
  `;

  // Ensure the popup is visible
  popup.style.display = "block";
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}


function colorIndex(cell) {
  let value = cell.getValue();
  let color = {
    "Index: 1": "#d53243",
    "Index: 2": "#e8862b",
    "Index: 3": "#e8862b",
    "Index: 4": "#f1b833",
    "Index: 5": "#abb731",
    "Index: 6": "#abb731",
    "Index: A": "#d53243",
    "Index: B": "#d53243",
    "Index: 0": "#d53243"
  }[value] || "white";
  
  cell.getElement().style.backgroundColor = color;
  return value;
}


