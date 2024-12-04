module TocHelper
  def extract_toc(html_document)
    TocExtractor.new(html_document).toc
  end

  class TocExtractor
    include ActionView::Helpers::UrlHelper
    include ActionView::Helpers::AssetUrlHelper

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
                  class: "#{toc_indent_class(node.name)} before:-ml-2 before:inline-block before:w-2 before:content-[' '] before:bg-cover before:bg-left before:bg-[url('check-circle-gray.svg')] block my-2 font-light text-sm text-orange-600 active:opacity-50 hover:text-orange-700")
        else
          tag.span(node.text, class: "#{toc_indent_class(node.name)} block my-1 text-base bg-red-600 text-white")
        end
      end

      def document
        html_fragment(@html_document)
      end

      def toc_indent_class(node_name)
        {
          "h2" => "",
          "h3" => "ml-4"
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
