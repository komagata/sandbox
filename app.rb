require 'sinatra'
require 'pathname'

class App < Sinatra::Base
  configure do
    set :app_file, __FILE__
    set :haml, {:attr_wrapper => '"', :ugly => false}
    set :sass, {:style => :expanded}
    set :raise_errors, true
  end

  helpers do
    alias h escape_html
  end

  get '/' do
    @files = Pathname.glob('public/static/*.html').map do |path|
      {:name => ,:link => }
    end
    haml :index
  end
end
