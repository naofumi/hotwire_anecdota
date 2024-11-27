module TocHelper
  def extract_toc(html_document)
    TocExtractor.new(html_document).toc
  end

  class TocExtractor
    include ActionView::Helpers::UrlHelper

    def initialize(html_document)
      @html_document = html_document
    end

    def toc
      document.children.each_with_object([]) do |node, memo|
        if /^h[2-3]$/.match?(node.name)
          memo << link_or_span(node)
        end
      end
    end

    private

      def link_or_span(node)
        if node.child["href"]
          link_to(node.text, node.child["href"],
                  class: "#{toc_indent_class(node.name)} block my-1 text-base text-orange-600")
        else
          tag.span(node.text, class: "#{toc_indent_class(node.name)} block my-1 text-base text-gray-600")
        end
      end

      def document
        html_fragment(@html_document)
      end

      def toc_indent_class(node_name)
        {
          "h2" => "",
          "h3" => "ml-3"
        }[node_name]
      end

      def html_fragment(html)
        if defined?(Nokogiri::HTML5)
          Nokogiri::HTML5.fragment(html)
        else
          Nokogiri::HTML4.fragment(html)
        end
      end
  end
end
