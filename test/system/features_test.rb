require "application_system_test_case"

class FeaturesTest < ApplicationSystemTestCase
  setup do
    @feature = features(:one)
  end

  test "visiting the index" do
    visit features_url
    assert_selector "h1", text: "Features"
  end

  test "should create feature" do
    visit features_url
    click_on "New feature"

    fill_in "Category", with: @feature.category
    fill_in "Descrption", with: @feature.descrption
    fill_in "Hotel", with: @feature.hotel_id
    fill_in "Image path", with: @feature.image_path
    fill_in "Position", with: @feature.position
    fill_in "Tagline", with: @feature.tagline
    click_on "Create Feature"

    assert_text "Feature was successfully created"
    click_on "Back"
  end

  test "should update Feature" do
    visit feature_url(@feature)
    click_on "Edit this feature", match: :first

    fill_in "Category", with: @feature.category
    fill_in "Descrption", with: @feature.descrption
    fill_in "Hotel", with: @feature.hotel_id
    fill_in "Image path", with: @feature.image_path
    fill_in "Position", with: @feature.position
    fill_in "Tagline", with: @feature.tagline
    click_on "Update Feature"

    assert_text "Feature was successfully updated"
    click_on "Back"
  end

  test "should destroy Feature" do
    visit feature_url(@feature)
    click_on "Destroy this feature", match: :first

    assert_text "Feature was successfully destroyed"
  end
end
