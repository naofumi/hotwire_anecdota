class FeaturesController < ApplicationController
  before_action :set_feature, only: %i[ show edit update destroy ]

  # GET /features or /features.json
  def index
    @features = Feature.all
  end

  # GET /features/1 or /features/1.json
  def show
  end

  # GET /features/new
  def new
    @feature = Feature.new
  end

  # GET /features/1/edit
  def edit
  end

  # POST /features or /features.json
  def create
    @feature = Feature.new(feature_params)

    respond_to do |format|
      if @feature.save
        format.html { redirect_to feature_url(@feature), notice: "Feature was successfully created." }
        format.json { render :show, status: :created, location: @feature }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @feature.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /features/1 or /features/1.json
  def update
    respond_to do |format|
      if @feature.update(feature_params)
        format.html { redirect_to feature_url(@feature), notice: "Feature was successfully updated." }
        format.json { render :show, status: :ok, location: @feature }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @feature.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /features/1 or /features/1.json
  def destroy
    @feature.destroy!

    respond_to do |format|
      format.html { redirect_to features_url, notice: "Feature was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feature
      @feature = Feature.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def feature_params
      params.require(:feature).permit(:tagline, :descrption, :category, :image_path, :position, :hotel_id)
    end
end
