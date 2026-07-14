class Api::V1::RacesController < ApplicationController
    BASE_URL = Rails.application.config.x.jolpica_base_url
    DEFAULT_SEASON = Time.current.year.to_s
    MIN_SEASON = 1950

    def index
        season=resolve_season(params[:year])
        response = HTTParty.get("#{BASE_URL}/#{season}/results.json?limit=100")
        render json: response.parsed_response
    end

    def show
        season=resolve_season(params[:year])
        response = HTTParty.get("#{BASE_URL}/#{season}/#{params[:id]}/results.json")
        render json: response.parsed_response
    end

    private

    def resolve_season(year_param)
        return DEFAULT_SEASON if year_param.blank?

        year = year_param.to_i
        return DEFAULT_SEASON if year < MIN_SEASON || year>DEFAULT_SEASON.to_i

        year.to_s
    end
end
