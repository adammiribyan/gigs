require 'test_helper'

class SongTest < ActiveSupport::TestCase
  test "should format name" do
    @song = FactoryGirl.create(:song, name: "Meds", artist: "Placebo")
    
    assert_equal "Placebo: Meds", @song.formated_name
  end
end
