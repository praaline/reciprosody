class Membership < ActiveRecord::Base
  attr_accessible :corpus_id, :role, :user_id
  
  belongs_to :corpus
  belongs_to :user
end