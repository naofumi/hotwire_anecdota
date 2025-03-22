module ContentTranslationHelper
  def translation_folder_path?(path)
    [ "/en" ].include? path
  end
end
