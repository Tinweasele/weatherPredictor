## Weather Predictor

This is a small script to query the USA weather service for forecasts.  

## Install instructions

Copy index.html and weatherPredictor.js into a folder and then just open index.html with any modern browser.

## Expandability

This script is just a small example of features available with the weather.gov API contained within are 3 fully customizable classes to expand functionality.  Currently the only dependancy is that if forecast is used, it requires weatherAPIcontroller to be defined.

- forecast
- weatherAPIcontroller
- displayController

# forecast

This class contains functions for manipulating and performing calculations on the JSON object that is the result of querying the API.  If you want to slice and dice the data differently this is where you would extend that sort of functionality.

# weatherAPIcontroller

This contains any of the functionality that directly interacts with the weather.gov API.  Currently my script only accesses the "points" and "grid/forcast" functionality of the weather API.  If there are any other calls or authentication to be added they should be expanded here.

# displayContoller

This class is responsible for modifying whatever display is being used for the data.  Expand this to make it pretty. :)

By Greg Quick
