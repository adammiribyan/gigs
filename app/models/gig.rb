class Gig < ActiveRecord::Base
  default_scope :order => "created_at DESC"
  
  validates :name, :place, :time, :presence => true  
end
