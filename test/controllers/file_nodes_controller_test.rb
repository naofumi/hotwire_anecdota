require "test_helper"

class FileNodesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @file_node = file_nodes(:one)
  end

  test "should get index" do
    get file_nodes_url
    assert_response :success
  end

  test "should get new" do
    get new_file_node_url
    assert_response :success
  end

  test "should create file_node" do
    assert_difference("FileNode.count") do
      post file_nodes_url, params: { file_node: { directory: @file_node.directory, name: @file_node.name } }
    end

    assert_redirected_to file_node_url(FileNode.last)
  end

  test "should show file_node" do
    get file_node_url(@file_node)
    assert_response :success
  end

  test "should get edit" do
    get edit_file_node_url(@file_node)
    assert_response :success
  end

  test "should update file_node" do
    patch file_node_url(@file_node), params: { file_node: { directory: @file_node.directory, name: @file_node.name } }
    assert_redirected_to file_node_url(@file_node)
  end

  test "should destroy file_node" do
    assert_difference("FileNode.count", -1) do
      delete file_node_url(@file_node)
    end

    assert_redirected_to file_nodes_url
  end
end
