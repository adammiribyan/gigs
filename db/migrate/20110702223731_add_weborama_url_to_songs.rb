class AddWeboramaUrlToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :weborama_url, :string
  end
end
