require 'test_helper'

class SongsControllerTest < ActionController::TestCase
  setup do
    @song = FactoryGirl.create(:song)
  end

  test "should get new" do
    get :new, gig_id: @song.gig.to_param
    assert_response :success
  end

  test "should create song" do
    assert_difference('Song.count') do
      post :create, song: @song.attributes, gig_id: @song.gig.to_param
    end

    assert_redirected_to assigns(:song)
  end

  test "should show song" do
    get :show, id: @song.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @song.to_param
    assert_response :success
  end

  test "should update song" do
    put :update, id: @song.to_param, song: @song.attributes
    assert_redirected_to assigns(:song)
  end

  test "should destroy song" do
    assert_difference('Song.count', -1) do
      delete :destroy, id: @song.to_param
    end

    assert_redirected_to @song.gig
  end
end
