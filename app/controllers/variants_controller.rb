class VariantsController < ApplicationController
  def update
    session[:variant] = params[:variant]&.gsub(/[^a-zA-Z0-9]/, "_")

    redirect_back_or_to root_path
  end
end
