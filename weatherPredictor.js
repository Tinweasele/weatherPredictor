//attach initial handlers
function populateEvents(){
	$('#tempPredict').click(getTemperature);
}

//run temperature fetch
async function getTemperature(){
	console.log('starting temp');
	//get values
	const display= new displayController();
	display.clearError();
	const lat=$('#lat').val();
	const lon=$('#long').val();
	
	//todo: data validation (need requirements)
	
	var weatherOutlook= new forecast(lat,lon);
	console.log(weatherOutlook);
	try{
		await weatherOutlook.resolveGrid();
		
	}catch(error){
		display.setError(error);
		return;
	}
	
	console.log('getForecast');
	try{
		await weatherOutlook.getForecast();	
	}catch(error){
		display.setError(error);
		return;
	}
	
	
	var temperatureForecast= weatherOutlook.getTemperature('Wednesday Night');
	display.setTempResult(temperatureForecast);
}

//holds data about our current forecast location
class forecast{
	constructor(lat,lon){
		this.lat=lat;
		this.lon=lon;
		this.jsonForecast=null;
		this.gridCoords={};
		this.weatherAPI=new weatherAPIcontroller();
		console.log(this.weatherAPI);
	}
	
	//resolve Lat lon to grid
	async resolveGrid(){
		try{
			this.gridCoords=await this.weatherAPI.points(this.lat,this.lon);
		} catch (error){
			throw error;
		}
	}
	
	//get forcast at grid
	async getForecast(){
		try{
			this.jsonForecast=await this.weatherAPI.forecast(this.gridCoords);
		} catch (error){
			throw error;
		}
	}
	
	//temperature hook on "day"
	getTemperature(timePeriod){
		const period =this.jsonForecast.properties.periods.find(({ name }) => name === timePeriod);
		return period.temperature;
	}
}

//Handles all API calls
class weatherAPIcontroller{
	constructor(){
		this.baseURL='https://api.weather.gov';
		this.jsonResult=null;
	}
	
	//build URL
	buildURL(callParams){
		return this.baseURL+callParams;
	}
	//run query
	async runQuery(builtURL){
		var result;
		console.log('running query: '+builtURL);
		try{
			result = await $.ajax({
				url:builtURL,
				type: 'GET',
				crossDomain: true,
				dataType: 'json'
			});
			console.log(result);
			return result;
		}catch (error){
			throw error;
		}
	}
	
	//retrieves grid coordinates at a given lat/lon
	async points(lat,lon){
		var gridCoords =new Object();
		var apiString='/points/';
		apiString+=lat;
		apiString+=",";
		apiString+=lon;
		
		var jsonResult;
		const URL=this.buildURL(apiString);
		console.log('starting query: '+URL);
		try{
			jsonResult=await this.runQuery(URL);
			console.log('exited');
		}catch(error){
			throw error;
		}
		console.log('done query');
		
		gridCoords.gridX = jsonResult.properties.gridX;
		gridCoords.gridY = jsonResult.properties.gridY;
		return gridCoords;
	}
	
	
	//gets full forcast for grid position
	async forecast(gridCoords){
		var apiString='/gridpoints/TOP/';
		apiString+=gridCoords.gridX;
		apiString+=',';
		apiString+=gridCoords.gridY;
		apiString+='/forecast';
		
		var jsonResult;
		const URL=this.buildURL(apiString);
		try{
			jsonResult=await this.runQuery(URL);
		}catch(error){
			throw error;
		}
		return jsonResult;
	}
	
}

class displayController{
	
	clearError(){
		$('#error').html('');
	}
	setError(string){
		$('#error').html(string);
	}
	setTempResult(string){
		$('#tempResult').val(string+='F');
	}
}









