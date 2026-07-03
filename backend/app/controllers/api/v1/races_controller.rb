class Api::V1::RacesController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url

    def index
        response = HTTParty.get("#{BASE_URL}/2025/result,json?limit=100")
        render json: response.parsed_response
    end

end
