class RemoveCodeFromSongs < ActiveRecord::Migration
  def up
    remove_column :songs, :code
  end

  def down
  end
end
