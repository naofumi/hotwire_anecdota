require "application_system_test_case"

class FileNodesTest < ApplicationSystemTestCase
  setup do
    @file_node = file_nodes(:one)
  end

  test "visiting the index" do
    visit file_nodes_url
    assert_selector "h1", text: "File nodes"
  end

  test "should create file node" do
    visit file_nodes_url
    click_on "New file node"

    fill_in "Directory", with: @file_node.directory
    fill_in "Name", with: @file_node.name
    click_on "Create File node"

    assert_text "File node was successfully created"
    click_on "Back"
  end

  test "should update File node" do
    visit file_node_url(@file_node)
    click_on "Edit this file node", match: :first

    fill_in "Directory", with: @file_node.directory
    fill_in "Name", with: @file_node.name
    click_on "Update File node"

    assert_text "File node was successfully updated"
    click_on "Back"
  end

  test "should destroy File node" do
    visit file_node_url(@file_node)
    click_on "Destroy this file node", match: :first

    assert_text "File node was successfully destroyed"
  end
end
