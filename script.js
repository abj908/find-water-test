async function loadLabs() {
    try {
      const response = await fetch('./data/labs.json');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json(); // Use .json() to parse directly
      return jsonData;
    } catch (error) {
      console.error("Error loading lab data:", error);
      // Handle the error appropriately, e.g., display an error message to the user
      return []; // Return an empty array to avoid further errors
    }
  }
  
  async function initialize() { // Wrap the initialization in an async function
      const labData = await loadLabs();
  
      document.getElementById('searchButton').addEventListener('click', () => {
          const municipality = document.getElementById('municipality').value.trim().toLowerCase();
          const resultsList = document.getElementById('labList');
          resultsList.innerHTML = '';
  
          const filteredLabs = labData.filter(lab => lab.Municipality.toLowerCase().includes(municipality));
  
          if (filteredLabs.length === 0) {
              const noResultsItem = document.createElement('li');
              noResultsItem.textContent = "No matching labs found.";
              resultsList.appendChild(noResultsItem);
          } else {
              filteredLabs.forEach(lab => {
                  const listItem = document.createElement('li');
                  listItem.textContent = `${lab["Lab Name"]} - ${lab.Municipality} - Phone: ${lab["Phone #"]}`;
                  resultsList.appendChild(listItem);
              });
          }
      });
  }
  
  initialize(); // Call the async initialization function