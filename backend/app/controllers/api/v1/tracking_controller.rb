class Api::V1::TrackingController < ApplicationController
  JOLPICA_BASE = Rails.application.config.x.jolpica_base_url
  OPENF1_BASE = Rails.application.config.x.openf1_base_url
  DOWNSAMPLE_INTERVAL_SECONDS = 1
  # Keeps ~1 point/sec per driver instead of OpenF1's raw ~3.7/sec

  def show
    year = params[:year]
    round = params[:round]

    race_date = fetch_race_date(year, round)
    return render json: { error: "Race not found" }, status: :not_found unless race_date

    session = fetch_session_for_date(year, race_date)
    return render json: { error: "No OpenF1 session found for this race — tracking data is only available from 2023 onward" }, status: :not_found unless session

    session_key = session["session_key"]
    drivers = fetch_drivers(session_key)
    location_data = fetch_location(session_key, session["date_start"], session["date_end"])
    tracking = downsample_and_group(location_data)

    render json: {
      session: session,
      drivers: drivers,
      tracking: tracking
    }
  end

  private

  # Gets the race's calendar date from Jolpica so we can match it to an OpenF1 session
  def fetch_race_date(year, round)
    response = HTTParty.get("#{JOLPICA_BASE}/#{year}/#{round}/races.json")
    races = response.parsed_response.dig("MRData", "RaceTable", "Races")
    races&.first&.dig("date")
  end

  # OpenF1 sessions don't use round numbers — match by year + date instead
  def fetch_session_for_date(year, race_date)
    response = HTTParty.get("#{OPENF1_BASE}/sessions", query: { year: year, session_type: "Race" })
    sessions = response.parsed_response
    return nil unless sessions.is_a?(Array)

    sessions.find { |s| s["date_start"].to_s.start_with?(race_date) }
  end

  # Driver info (names, team colors, numbers) for the legend
  def fetch_drivers(session_key)
    response = HTTParty.get("#{OPENF1_BASE}/drivers", query: { session_key: session_key })
    response.parsed_response
  end

  # Raw x/y/z location data for every car in the session
  def fetch_location(session_key, session_start, session_end)
    all_points = []
    window_seconds = 400
    current_start = Time.parse(session_start)
    final_end = Time.parse(session_end)

    while current_start < final_end
      current_end = [current_start + window_seconds, final_end].min

      response = HTTParty.get("#{OPENF1_BASE}/location", query: {
        session_key: session_key,
        "date>" => current_start.iso8601,
        "date<" => current_end.iso8601
      })

      all_points.concat(response.parsed_response) if response.parsed_response.is_a?(Array)
      current_start = current_end
    end

    all_points
  end

  # Groups raw points by driver, then keeps only ~1 point/sec to cut payload size
  def downsample_and_group(location_data)
    return {} unless location_data.is_a?(Array)

    grouped = location_data.group_by { |point| point["driver_number"] }

    grouped.transform_values do |points|
      sorted = points.sort_by { |p| p["date"] }
      last_kept_time = nil

      sorted.each_with_object([]) do |point, kept|
        current_time = Time.parse(point["date"])
        if last_kept_time.nil? || (current_time - last_kept_time) >= DOWNSAMPLE_INTERVAL_SECONDS
          kept << { t: point["date"], x: point["x"], y: point["y"] }
          last_kept_time = current_time
        end
      end
    end
  end
end