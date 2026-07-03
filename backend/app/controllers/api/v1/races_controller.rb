class Api::V1::RacesController < ApplicationController
    BASE_URL = "https://api.jolpi.ca/ergast/f1"

    def index
        response = HTTParty.get("#{BASE_URL}/2025/result,json?limit=100")
        render json: response.parsed_response
    end
    
end
