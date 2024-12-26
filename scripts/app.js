document.getElementById("zipcode-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const zipCode = document.getElementById("zipcode").value.trim();
    
    if (!zipCode) return alert("Please enter a valid ZIP code.");
  
    // Fetch and parse CSV data
    const csvData = await fetch('./data/labs.csv').then(res => res.text());
    const labs = parseCSV(csvData);
  
    // Geocode the ZIP code
    const userCoords = await geocodeZIP(zipCode);
  
    // Rank labs by proximity
    const rankedLabs = rankLabsByProximity(labs, userCoords);
  
    // Display results
    displayResults(rankedLabs);
  });
  
  // Parse CSV to JSON
  function parseCSV(csv) {
    const rows = csv.split('\n').filter(row => row.trim() !== '');
    const headers = rows.shift().split(',');
  
    return rows.map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });
  }
  
  // Geocode ZIP code
  async function geocodeZIP(zipCode) {
    const apiKey = "YOUR_API_KEY"; // Replace with your geocoding API key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`);
    const data = await response.json();
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  
  // Rank labs by proximity
  function rankLabsByProximity(labs, userCoords) {
    return labs.map(lab => {
      const labCoords = { lat: parseFloat(lab.Latitude), lng: parseFloat(lab.Longitude) };
      const distance = haversineDistance(userCoords, labCoords);
      return { ...lab, distance };
    }).sort((a, b) => a.distance - b.distance);
  }
  
  // Haversine formula
  function haversineDistance(coords1, coords2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = degToRad(coords2.lat - coords1.lat);
    const dLng = degToRad(coords2.lng - coords1.lng);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(degToRad(coords1.lat)) * Math.cos(degToRad(coords2.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }
  
  // Display results
  function displayResults(labs) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
  
    labs.forEach(lab => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <h3>${lab["Lab Name"]}</h3>
        <p>Contact: ${lab["Contact Name"]}</p>
        <p>Phone: ${lab["Phone #"]}</p>
        <p>Distance: ${lab.distance.toFixed(2)} km</p>
      `;
      resultsContainer.appendChild(div);
    });
  }
  