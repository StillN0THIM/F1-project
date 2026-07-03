class Api::V1::StandingsController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url

    def index
    drivers      = HTTParty.get("#{BASE_URL}/2025/driverStandings.json")
    constructors = HTTParty.get("#{BASE_URL}/2025/constructorStandings.json")
    # Fetches both driver and constructor standings in parallel requests

    render json: {
        drivers:      drivers.parsed_response,
        constructors: constructors.parsed_response
    }
    # Returns both as a single JSON object so React only needs one API call
    end
end