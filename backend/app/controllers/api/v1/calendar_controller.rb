class Api::V1::CalendarController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url
    SEASON = Time.current.year.to_s

    def index
    response = HTTParty.get("#{BASE_URL}/#{SEASON}/races.json?limit=100")
    # Fetches the full 2025 race calendar including circuit info and dates

    render json: response.parsed_response
    end
end
