class VariantsController < ApplicationController
  def update
    session[:variant] = variant_params[:name]&.gsub(/[^a-zA-Z0-9]/, "_")

    redirect_back_or_to root_path
  end

  private

    def variant_params
      params.require(:variant).permit(:name)
    end
end
