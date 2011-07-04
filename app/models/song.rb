class Song < ActiveRecord::Base
  default_scope order: "created_at ASC"
  
  belongs_to :gig
  
  def to_s
    "#{artist}: #{name}"
  end
end
