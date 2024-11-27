ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

class ActionDispatch::IntegrationTest
  def login_user(user, &block)
    Current.stub :user, user do
      block.call
    end
  end

  def with_variant(variant, &block)
    selector_mock = Minitest::Mock.new.expect :validated_variant, variant, [ nil ]
    Variantable::VariantSelector.stub :new, selector_mock do
      block.call
    end
  end
end
