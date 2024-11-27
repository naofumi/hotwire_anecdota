# frozen_string_literal: true

require "test_helper"

class ViewTemplateCollectableTest < ActionDispatch::IntegrationTest
  class MockController < ApplicationController
    include ViewTemplateCollectable

    collect_view_templates "components"
  end

  test "view_templates includes top view 'accordion'" do
    assert_includes MockController.new.send(:view_templates), "accordion"
  end

  test "view_templates does not include partial '_accordion_row'" do
    assert_not_includes MockController.new.send(:view_templates), "_accordion_row"
  end

  test "view_templates does not include top view 'index'" do
    assert_not_includes MockController.new.send(:view_templates), "index"
  end
end
