class PublicationMembership < ActiveRecord::Base
  belongs_to :user
  belongs_to :publication
  attr_accessible :role, :user_id, :publication_id

  def self.roles
  	['owner', 'reviewer', 'member']
  end

end
