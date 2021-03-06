class Tool < ActiveRecord::Base
  include UserActionable
  include ActiveModel::Validations
  require 'uri'

  attr_accessible :authors, :description, :keywords, :license, :local, :name, :programming_language, :url
  paginates_per 3

  has_many :users, :through => :tool_memberships
  has_many :tool_memberships                                        
  accepts_nested_attributes_for :tool_memberships                       #delete *tool-user relationships

  has_many :corpora, :through => :tool_corpus_relationships
  has_many :tool_corpus_relationships, :dependent => :delete_all        #delete *tool-corpus relationships

  has_many :publications, :through => :tool_publication_relationships
  has_many :tool_publication_relationships, :dependent => :delete_all   #delete *tool-publication relationships

  has_many :user_actions, :as => :user_actionable

  scope :tool_owner_of,     -> { (where tool_memberships: {role: 'owner'}).order(:updated_at => :desc) }
  scope :tool_reviewer_of,  -> { (where tool_memberships: {role: 'reviewer'}).order(:updated_at => :desc) }
  scope :tool_member_of,    -> { (where tool_memberships: {role: 'member'}).order(:updated_at => :desc) }

  before_destroy :remove_dirs

  #---Validations------------------------
  validates :name, :presence => true
  validates :url, :url => true, :allow_blank => true
  #--------------------------------------

  def self.membership_class
    ToolMembership
  end

  def self.valid_orders()
    ["created_at", "updated_at", "name"]
  end

  # returns an array
  def self.wsearch(q)
    if(q !~ /^\%.+\%$/)
      q = "%#{q}%"
    end

    # let's not rely on implicit type changes
    chosen =  where('name LIKE ? AND description LIKE ?', q, q).to_a
    chosen += where('name LIKE ?', q).to_a
    chosen += where('authors LIKE ?', q).to_a
    chosen += where('keywords LIKE ?', q).to_a
    chosen += where('description LIKE ?', q).to_a

    chosen.uniq!
    return chosen
  end

  def to_timestring
    self.updated_at.strftime("%m-%d-%Y")
  end

  def to_short_description_string
    host = URI.parse(url).host
    host.gsub!(/^www\./, "")
    
    short = nil
    
    if host == "github.com" || host == "code.google.com"
      if(url =~ /\/([^\/]+)\/?$/)
        short = $1
      end
    end

    return [short, host]
  end

  def canEdit?(user)
  	return false unless user
  	return true if user.super_key != nil
  	return true if self.owners.include? user
  	return false
  end

  def associated_users
    owners + reviewers + members
  end

  def owners
  	self.users.tool_owners.all
  end

  def reviewers
  	self.users.tool_reviewers.all
  end

  def members
  	self.users.tool_members.all
  end

  def keywords_array
    self.keywords.to_s.split(/[^\w,\-]+/)
  end

  def ac_small_format
    "#{self.name}<#{self.id}>"
  end

  def dir_path
    "tools/#{self.id}"
  end

  def remove_dirs
    FileUtils.rm_rf(dir_path) if Dir.exists?(dir_path)
  end

end
