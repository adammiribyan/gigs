class Song < ActiveRecord::Base
  default_scope order: "created_at ASC"
  
  belongs_to :gig
  
  def formated_name
    "#{artist}: #{name}"
  end
end
