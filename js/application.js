function requestStationsInformation(){
  let api_data_array = {
    'general': {
      name: 'All stations',
      id: 'general',
      lastUpdated: 'N/A',
      totalBikes: 55,
      lastUsedBikes: 52,
      lastFreeBikes: 3,
      data: [
        [1486684800000, 34], 
        [1486771200000, 43], 
        [1486857600000, 31] , 
        [1486944000000, 43], 
        [1487030400000, 33], 
        [1487116800000, 52]
      ]
    },
    'station_1': {
      name: 'Alameda',
      id: 'station_1',
      lastUpdated: '2019-06-05T02:01:00.209000Z',
      totalBikes: 9,
      lastUsedBikes: 5,
      lastFreeBikes: 4,
      data: [
        [1486684800000, 5], 
        [1486771200000, 7], 
        [1486857600000, 6] , 
        [1486944000000, 3], 
        [1487030400000, 3], 
        [1487116800000, 5]
      ]
    },
    'station_2': {
      name: 'U. de Chile',
      id: 'station_1',
      lastUpdated: '2019-06-05T02:01:00.209000Z',
      totalBikes: 7,
      lastUsedBikes: 3,
      lastFreeBikes: 4,
      data: [
        [1486684800000, 6], 
        [1486771200000, 3], 
        [1486857600000, 2] , 
        [1486944000000, 9], 
        [1487030400000, 7], 
        [1487116800000, 3]
      ]
    }
  }

  return api_data_array
}

function getSingleStationInformation(stationId){
  let data_array = requestStationsInformation();

  return data_array[stationId]
}

function fillMenu(){
  const dataArray = requestStationsInformation();
  const menu = document.querySelector('#station-selector');
  
  for(var stationId in dataArray){
    let option = document.createElement('option');
    option.value = stationId;
    option.innerText = dataArray[stationId].name;
    
    menu.appendChild(option);
  }
}

function renderView(stationId){
  const stationInfo = getSingleStationInformation(stationId); 
  // Render station name and time of the last update
  document.querySelector('#station-name').innerText = stationInfo.name;
  document.querySelector('#station-last-update').innerText = stationInfo.lastUpdated == 'N/A' ? stationInfo.lastUpdated : moment(stationInfo.lastUpdated).calendar();
  // Render numbers
  document.querySelector('#station-total').innerText = stationInfo.totalBikes;
  document.querySelector('#station-used').innerText = stationInfo.lastUsedBikes;
  document.querySelector('#station-free').innerText = stationInfo.lastFreeBikes;
  // Render chart
  renderChart(stationInfo.data);
}

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
        type: 'datetime'
      }
    };
    
    window.chartElement = new ApexCharts(document.querySelector("#chart"), options);
    
    window.chartElement.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fillMenu();
  renderView('general')

  document.querySelector('#station-selector').addEventListener('change', function(event){
    console.log(`Selected ${event.target.value}`)
    const id = event.target.value
    renderView(id);
  });
});