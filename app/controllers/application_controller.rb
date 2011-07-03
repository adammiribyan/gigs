class ApplicationController < ActionController::Base
  # HTTP Authentication
  http_basic_authenticate_with name: "admin", password: "monkey"
  
  protect_from_forgery
end
