class Api::V1::CalendarController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url

    def index
    response = HTTParty.get("#{BASE_URL}/2026/races.json?limit=100")
    # Fetches the full 2025 race calendar including circuit info and dates

    render json: response.parsed_response
    end
end
