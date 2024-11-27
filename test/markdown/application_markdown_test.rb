require 'test_helper'

class ApplicationMarkdownTest < ActiveSupport::TestCase
  test "fixture values are valid" do
    sazae = customers(:sazae)
    assert sazae.valid?
  end
end
