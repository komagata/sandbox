require 'rubygems'
require 'sinatra'

use Rack::Static, :urls => ['/'], :root => 'public'
run Sinatra::Application
