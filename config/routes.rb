Gigs::Application.routes.draw do
  resources :gigs

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'gigs#index'
end
