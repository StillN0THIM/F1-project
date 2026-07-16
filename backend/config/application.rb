require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.x.jolpica_base_url = "https://api.jolpi.ca/ergast/f1"
    # Stores the base URL as an app-wide config value
    # accessible anywhere via Rails.application.config.x.jolpica_base_url

    config.x.jolpica_base_url = ENV["JOLPICA_BASE_URL"]
    # Reads from .env in development, from Railway/Render's env vars in production

    config.x.openf1_base_url = "https://api.openf1.org/v1"

    config.x.openf1_base_url = ENV["OPENF1_BASE_URL"] if ENV["OPENF1_BASE_URL"].present?

    config.x.frontend_url = ENV["FRONTEND_URL"]
    #for the backend to communicate to the frontend 
    
    config.x.current_season = ENV["CURRENT_SEASON"]
    #so year isn't hardcoded in the codebase
  
  end
end
