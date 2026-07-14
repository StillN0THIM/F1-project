class Api::V1::StandingsController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url
    DEFAULT_SEASON = Time.current.year.to_s
    MIN_SEASON=1950



    def index
    season = resolve_season(params[:year])
    drivers      = HTTParty.get("#{BASE_URL}/#{season}/driverStandings.json")
    constructors = HTTParty.get("#{BASE_URL}/#{season}/constructorStandings.json")


    render json: {
        drivers:      drivers.parsed_response,
        constructors: constructors.parsed_response
    }
    # Returns both as a single JSON object so React only needs one API call
    end

    private
    
    def resolve_season(year_param)
        return DEFAULT_SEASON if year_param.blank?

        year = year_param.to_i
        return DEFAILT_SEASON if year < MIN_SEASON || year>DEFAULT_SEASON.to_i

        year.to_s
    end

end