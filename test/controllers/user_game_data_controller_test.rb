require "test_helper"

class UserGameDataControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get user_game_data_create_url
    assert_response :success
  end

  test "should get show" do
    get user_game_data_show_url
    assert_response :success
  end

  test "should get update" do
    get user_game_data_update_url
    assert_response :success
  end
end
