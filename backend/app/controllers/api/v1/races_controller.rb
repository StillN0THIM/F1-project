class Api::V1::RacesController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url
    SEASON = Time.current.year.to_s

    def index
        response = HTTParty.get("#{BASE_URL}/#{SEASON}/results.json?limit=100")
        # All 2025 race results — no /races/ needed in the URL
        render json: response.parsed_response
    end

    def show
        response = HTTParty.get("#{BASE_URL}/#{SEASON}/#{params[:id]}/results.json")
        # Single race by round number — /2025/1/results.json for round 1
        render json: response.parsed_response
    end
end
