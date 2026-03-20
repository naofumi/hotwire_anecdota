module CssHelper
  # URLs often contain characters (for example "/") that are invalid in
  # `view-transition-name`, so we normalize them for stable transition keys.
  def view_transition_name(value)
    value.to_s.gsub(/[^a-zA-Z0-9_-]/, '__')
  end
end
