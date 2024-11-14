# You should read the docs at https://github.com/vmg/redcarpet and probably
# delete a bunch of stuff below if you don't need it.

class ApplicationMarkdown < MarkdownRails::Renderer::Rails
  include ActionView::Helpers::OutputSafetyHelper
  include ActionView::Helpers::UrlHelper
  # Reformats your boring punctation like " and " into “ and ” so you can look
  # and feel smarter. Read the docs at https://github.com/vmg/redcarpet#also-now-our-pants-are-much-smarter
  include Redcarpet::Render::SmartyPants

  # Run `bundle add rouge` and uncomment the include below for syntax highlighting
  include MarkdownRails::Helper::Rouge

  # If you need access to ActionController::Base.helpers, you can delegate by uncommenting
  # and adding to the list below. Several are already included for you in the `MarkdownRails::Renderer::Rails`,
  # but you can add more here.
  #
  # To see a list of methods available run `bin/rails runner "puts ActionController::Base.helpers.public_methods.sort"`
  #
  # delegate \
  #   :request,
  #   :cache,
  #   :turbo_frame_tag,
  # to: :helpers

  # These flags control features in the Redcarpet renderer, which you can read
  # about at https://github.com/vmg/redcarpet#and-its-like-really-simple-to-use
  # Make sure you know what you're doing if you're using this to render user inputs.
  def enable
    [:fenced_code_blocks]
  end

  # https://github.com/sitepress/markdown-rails?tab=readme-ov-file#customizing-renderer
  FORMATTER = Rouge::Formatters::HTMLInline.new("monokai.sublime")

  def block_code(code, language)
    language_part, filename_part = language.split(':', 2).map(&:strip)
    lexer = Rouge::Lexer.find(language_part)
    content_tag(:div, class: "my-2") do
      safe_join([
                  content_tag(:div, filename_part || language_part, class: "px-2 border rounded-t text-sm border-gray-700 bg-gray-700 text-gray-100 w-fit"),
                  content_tag(:pre, class: "#{language_part} bg-[#272822] px-1 py-2 text-gray-100 border rounded rounded-tl-none border-black text-sm overflow-x-auto") do
                    raw FORMATTER.format(lexer.lex(code))
                  end
                ])
    end
  end

  # Example of how you might override the images to show embeds, like a YouTube video.
  # def image(link, title, alt)
  #   url = URI(link)
  #   case url.host
  #   when "www.youtube.com"
  #     youtube_tag url, alt
  #   else
  #     super
  #   end
  # end

  def image(link, title, alt)
    # We use css_classes instead of the title, and use
    # alt for the title
    css_classes = title
    extension = link.match(/\.(\w{3,4})$/)&.captures&.first

    case extension
    when "webp", "jpg", "jpeg", "gif", "png"
      image_tag(link, alt: alt, title: alt, class: css_classes)
    when "mov"
      tag.video src: video_path(link), width: 733, height: 606, muted: true,
                autoplay: true, playsinline: true, controls: true,
                loop: true, class: css_classes, data: { turbo_permanent: true }
    end
  end

  # Create a link with a hash target.
  #
  # Split the displayed text and the hash fragment with "---"
  #
  # example:
  #   ## どの技術を使うべきか？ --- technology-choice
  #
  def header(text, header_level)
    title, fragment = text.split(/---/).map(&:strip)
    if fragment.present?
      content_tag("h#{header_level}", id: fragment) do
        link_to title.html_safe, "\##{fragment}"
      end
    else
      content_tag("h#{header_level}", text.html_safe)
    end
  end

  private

    # This is provided as an example; there's many more YouTube URLs that this wouldn't catch.
    # def youtube_tag(url, alt)
    #   embed_url = "https://www.youtube-nocookie.com/embed/#{CGI.parse(url.query).fetch("v").first}"
    #   content_tag :iframe,
    #               src: embed_url,
    #               width: 560,
    #               height: 325,
    #               allow: "encrypted-media; picture-in-picture",
    #               allowfullscreen: true \
    #     do
    #       alt
    #     end
    # end
end
