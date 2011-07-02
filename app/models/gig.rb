class Gig < ActiveRecord::Base
  default_scope order: "created_at DESC"
  
  has_many :songs, :dependent => :destroy
  
  validates :name, :place, :time, presence: true  
end
