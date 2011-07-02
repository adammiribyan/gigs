class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :artist
      t.text :code
      t.text :lyrics
      t.string :chords_url

      t.timestamps
    end
  end
end
