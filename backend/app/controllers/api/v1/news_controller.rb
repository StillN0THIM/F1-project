class Api::V1::NewsController < ApplicationController
    FEEDS = [
    "https://www.autosport.com/rss/f1/news/",
    "https://www.the-race.com/feed/",
    "https://feeds.bbci.co.uk/sport/formula1/rss.xml"
    ]
    # The three RSS sources we decided on

    def index
    articles = FEEDS.flat_map do |url|
        feed = Feedjira.parse(HTTParty.get(url).body)
        # Fetches and parses each RSS feed from XML into a Ruby object

        feed.entries.first(10).map do |entry|
        title     = entry.title
        url       = entry.url
        published = entry.published
        source    = feed.title

        { title: title, url: url, published: published, source: source }
        # Builds a clean hash for each article with only the fields we need
        end
    end

    render json: articles.sort_by { |a| a[:published] }.reverse
    # Sorts all articles newest first regardless of which source they came from
    end
end