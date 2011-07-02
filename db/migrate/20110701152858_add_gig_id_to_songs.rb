class AddGigIdToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :gig_id, :integer
  end
end
