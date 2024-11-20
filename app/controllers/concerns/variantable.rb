module Variantable
  extend ActiveSupport::Concern

  class VariantSelector
    def initialize(available_variants)
      @available_variants = available_variants
    end

    def validated_variant(variant)
      variant_available?(variant) ? variant.to_sym : default_variant
    end

    def variant_available?(variant)
      variant.present? && @available_variants.include?(variant.to_sym)
    end

    def default_variant
      @available_variants.first
    end
  end

  included do
    helper_method :available_variants
  end

  class_methods do
    def set_available_variants(*variants)
      @@available_variants = variants
    end
  end

  private

    # Validates that the variant is included in @@available_variants
    # and returns the validated variant.
    # If it is not included, then returns the default variant, which is
    # the first variant in @@available_variants
    def validated_variant(variant)
      VariantSelector.new(available_variants).validated_variant(variant)
    end

    def variant_available?(variant)
      VariantSelector.new(available_variants).variant_available?(variant)
    end

    def default_variant
      VariantSelector.new(available_variants).first
    end

    def available_variants
      [] #self.class.class_variable_defined?(:@@available_variants) ? @@available_variants : []
    end
end
