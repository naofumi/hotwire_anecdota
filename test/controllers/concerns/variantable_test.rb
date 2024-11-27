# frozen_string_literal: true

require "test_helper"

class VariantableTest < ActionDispatch::IntegrationTest
  class MockVariantableController < ApplicationController
    include Variantable

    set_available_variants :default_variant, :available_variant
  end

  test "private validated_variant returns variant if available" do
    assert :available_variant, MockVariantableController.new.send(:validated_variant, :available_variant)
  end

  test "private validated_variant returns default if unavailable" do
    assert :default_variant, MockVariantableController.new.send(:validated_variant, :unavailable_variant)
  end

  test "available_variants returns correct values" do
    assert [ :default_variant, :available_variant ], MockVariantableController.new.send(:available_variants)
  end
end
