source 'https://rubygems.org'

gem 'rails', '4.0.2'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'sqlite3'
gem 'puma' #07-22-2013
gem 'thin'
gem 'faye' #sfr
gem 'passenger'
gem 'eventmachine' #sfr
gem 'kaminari'


# Gems used only for assets and not required
# in production environments by default.
group :assets do
  #gem 'sass-rails',   '~> 3.2.5' 
  # sass fails to compile bootstrap
  # therefore had to be removed
  
  # to hell with coffee-script.
  #gem 'coffee-rails', '~> 3.2.1'
  
  gem 'uglifier', '>= 1.0.3'

  gem 'font-awesome-rails'
  gem 'less-rails', '2.3.3'
  #gem 'libv8', '~> 3.3.10'
  gem 'therubyracer'
end

gem 'jquery-rails', '2.1.4'

#---Modified by Me -SFR----------------
gem 'twitter-bootstrap-rails', '2.2.7'  # Needed for Glyphicons to work
gem 'devise', '3.0.0'                   # Must be specifically set to 3.0.0
gem "recaptcha", :require => "recaptcha/rails"
gem 'nifty-generators'
gem "rails3-jquery-autocomplete"

# HAD to get rid of this, it was causing `require` failures
# gem "activerecord-import" #for bulk importing data

gem "redcarpet", "1.17.2"
gem "nokogiri"
gem 'acts_as_commentable_with_threading'
gem 'carrierwave'
gem 'waveinfo'

# 01-28-2014
# Rails 4 fix for this as of 13 days ago
# The downside to being too bleeding edge
# https://github.com/LTe/acts-as-messageable/issues/57
# gem 'acts-as-messageable', :git => 'git://github.com/hoczaj/acts-as-messageable.git'
gem 'acts-as-messageable', :git => 'https://github.com/fahmidur/acts-as-messageable'

gem 'bibtex-ruby', :require => 'bibtex'
gem 'citeproc-ruby', :require => 'citeproc'
gem 'mail_view', '~> 1.0.3'
gem 'simplecov', :require => false, :group => :test

gem 'paperclip', '~> 3.0'
gem 'fog'
#---------------------------------------------



group :production do
  gem "mysql2"
end

group :development, :test do
  # gem 'sqlite3'
  # gem "mysql"
  # gem "activerecord-mysql-adapter"
  # gem "activerecord-mysql2-adapter"
  gem 'capistrano'

  # gem 'rspec-rails', ">= 2.0"
  gem "factory_girl_rails", "~> 4.0"
  
  gem "capybara"
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'rails-erd'
end

#--------------------------------------


# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'



# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'debugger'

#Added by SFR for Rails 4.0 transition
gem "activerecord-session_store"
gem "protected_attributes"
