require "application_system_test_case"

class BucketsTest < ApplicationSystemTestCase
  setup do
    @bucket = buckets(:one)
  end

  test "visiting the index" do
    visit buckets_url
    assert_selector "h1", text: "Buckets"
  end

  test "should create bucket" do
    visit buckets_url
    click_on "New bucket"

    fill_in "Name", with: @bucket.name
    fill_in "Position", with: @bucket.position
    click_on "Create Bucket"

    assert_text "Bucket was successfully created"
    click_on "Back"
  end

  test "should update Bucket" do
    visit bucket_url(@bucket)
    click_on "Edit this bucket", match: :first

    fill_in "Name", with: @bucket.name
    fill_in "Position", with: @bucket.position
    click_on "Update Bucket"

    assert_text "Bucket was successfully updated"
    click_on "Back"
  end

  test "should destroy Bucket" do
    visit bucket_url(@bucket)
    click_on "Destroy this bucket", match: :first

    assert_text "Bucket was successfully destroyed"
  end
end
