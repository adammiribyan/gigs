require 'test_helper'

class SongTest < ActiveSupport::TestCase
  test "should format name" do
    @song = FactoryGirl.create(:song, name: "Meds", artist: "Placebo")
    
    assert_equal "Placebo: Meds", @song.to_s
  end
end
