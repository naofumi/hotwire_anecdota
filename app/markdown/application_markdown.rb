# You should read the docs at https://github.com/vmg/redcarpet and probably
# delete a bunch of stuff below if you don't need it.

class ApplicationMarkdown < MarkdownRails::Renderer::Rails
  THEME = "monokai.sublime"
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
    [:fenced_code_blocks, :disable_indented_code_blocks, :underline, :footnotes, :tables, :strikethrough,
     :no_intra_emphasis]
  end

  # https://github.com/sitepress/markdown-rails?tab=readme-ov-file#customizing-renderer
  FORMATTER = Rouge::Formatters::HTMLInline.new(THEME)

  def block_code(code, language)
    language_part, filename_part = language.split(":", 2).map(&:strip)
    lexer = Rouge::Lexer.find(language_part)
    content_tag(:div, class: "my-2") do
      safe_join [
                  tag.div(class: "px-2 border rounded-t text-sm border-gray-700 bg-gray-700 text-gray-100 w-fit") {
                    safe_join [
                                tag.span(filename_part || language_part),
                                filename_part && link_to(github_logo, github_link(filename_part), target: "_blank", rel: "noopener")
                              ]
                  },
                  tag.pre(class: "#{language_part} bg-[#272822] px-1 py-2 text-gray-100 border rounded rounded-tl-none border-black text-sm overflow-x-auto") {
                    raw FORMATTER.format(lexer.lex(code)) # rubocop:disable Rails/OutputSafety
                  }
                ]
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

    if URI(link).host == "www.youtube.com"
      youtube_tag link, alt
    else
      case extension
      when "webp", "jpg", "jpeg", "gif", "png"
        link_to image_path(link), target: "image", class: "#{css_classes} block" do
          image_tag(link, alt: alt, title: alt)
        end
      when "mov"
        tag.video src: video_path(link), width: 733, height: 606, muted: true,
                  autoplay: true, playsinline: true, controls: true,
                  loop: true, class: css_classes, data: { turbo_permanent: true }
      end
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
        link_to title.html_safe, "\##{fragment}" # rubocop:disable Rails/OutputSafety
      end
    else
      content_tag("h#{header_level}", text.html_safe) # rubocop:disable Rails/OutputSafety
    end
  end

  def link(link, title, content)
    if title =~ /\Ademo/
      link_to content, link, class: "after:content-['demo'] after:text-xs after:text-[10px] after:align-top after:text-green-500 after:rotate-[45deg] after:bg-orange-600 after:text-white after:inline-block after:rounded after:px-1"
    elsif link =~ /components\//
      link_to content, link, class: "after:content-['demo'] after:text-xs after:text-[10px] after:align-top after:text-green-500 after:rotate-[45deg] after:bg-orange-600 after:text-white after:inline-block after:rounded after:px-1"
    else
      link_to content, link, title: title
    end
  end

  private

    def github_logo
      <<~HTML.html_safe # rubocop:disable Rails/OutputSafety
        <svg class="ml-4 h-6 w-6 inline-block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
        </svg>
      HTML
    end

    def github_link(filename)
      "https://github.com/naofumi/hotwire_anecdota/tree/master/#{filename}"
    end

    # This is provided as an example; there's many more YouTube URLs that this wouldn't catch.
    def youtube_tag(link, alt)
      url = URI(link)
      embed_url = "https://www.youtube-nocookie.com/embed/#{CGI.parse(url.query).fetch("v").first}"
      content_tag(:iframe,
                  src: embed_url,
                  title: "YouTube video player",
                  # width: 560,
                  # height: 315,
                  allow: "accelorometer; clipboard-write; gyroscope: encrypted-media; picture-in-picture; web-share",
                  referrerpolicy: "strict-origin-when-cross-origin",
                  allowfullscreen: true,
                  class: "mx-auto w-full max-w-[560px] aspect-video my-8",
      ) do
        alt
      end
    end
end
