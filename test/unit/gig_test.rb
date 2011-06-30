require 'test_helper'

class GigTest < ActiveSupport::TestCase
  test "should validates presence of all fields" do
    placebo_gig = FactoryGirl.build(:gig)
    madonna_gig = FactoryGirl.build(:gig, name: nil)
    
    assert placebo_gig.valid?
    assert madonna_gig.invalid?
  end
end
