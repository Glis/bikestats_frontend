// Function that loads all the data from the API module.
// It fetches the data, and if it fails it shows an error.
// If it's successfull, it saves the data in the array an renders the view
function requestAndLoadStations(){
  console.log('Loading stations from the api....');
  
  fetch('http://localhost:3000/v1/stations')
    .then((response) => {
      // handle error response
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      return response.json();
    })
    .then((myJson) => {
      console.log('All stations loaded!');
      document.allStationsInfo = myJson;
      
      // display the content
      document.getElementById("loading").setAttribute('hidden','');
      document.getElementById("content-wrapper").removeAttribute('hidden');

      // Fill the menu
      fillMenu();

      // Render the whole view
      renderView('general')

      // Register the selector event.
      document.querySelector('#station-selector').addEventListener('change', function(event){
        console.log(`Selected ${event.target.value}!`)
        const id = event.target.value
        renderView(id);
      });
    })
    .catch( err => {
      // display an error message
      document.getElementById("loading").setAttribute('hidden','');
      document.getElementById("loading-error").removeAttribute('hidden');
      console.log(err)
    });
}

// Getter a single station from the array
function getSingleStationInformation(stationId){
  return document.allStationsInfo[stationId]
}

// Fills the select menu with all the stations
function fillMenu(){
  const dataArray = document.allStationsInfo;
  const menu = document.querySelector('#station-selector');
  
  for(var stationId in dataArray){
    let option = document.createElement('option');
    option.value = stationId;
    option.innerText = dataArray[stationId].name;
    
    menu.appendChild(option);
  }
}

// Renders the whole view. including:
// - Name of the station and last update date
// - Totals statistics of the station
// - the Chart
function renderView(stationId){
  const stationInfo = getSingleStationInformation(stationId); 
  // Render station name and time of the last update
  document.querySelector('#station-name').innerText = stationInfo.name;
  document.querySelector('#station-last-update').innerText = stationInfo.lastUpdated == 'N/A' ? stationInfo.lastUpdated : moment(stationInfo.lastUpdated).calendar();
  // Render totals
  document.querySelector('#station-total').innerText = stationInfo.totalBikes;
  document.querySelector('#station-used').innerText = stationInfo.lastUsedBikes;
  document.querySelector('#station-free').innerText = stationInfo.lastFreeBikes;
  // Render chart
  renderChart(stationInfo.data);
}

// Renders the chart. If the chart is already rendered, just update the series data.
function renderChart(usageData){
  if(window.chartElement != undefined){
    window.chartElement.updateSeries([{data: usageData}]);
  }else{
    var options = {
      chart: {
        height: 380,
        width: "100%",
        type: "line"
      },
      series: [
        {
          name: "Bikes in use",
          data: usageData
        }
      ],
      xaxis: {
        type: 'datetime',
        title: {
          text: 'Per minute'
        }
      },
      yaxis: {
        title: {
          text: 'Bikes used'
        }
      }
    };
    
    window.chartElement = new ApexCharts(document.querySelector("#chart"), options);
    
    window.chartElement.render();
  }
}

// Main function:
// When the DOM is loaded executes a request to the API and fills the page with data
document.addEventListener('DOMContentLoaded', () => {
  requestAndLoadStations();
});