class RoomNightsController < ApplicationController
  before_action :set_room_night, only: [ :show, :edit, :update, :destroy ]

  # GET /room_nights or /room_nights.json
  def index
    @room_nights = RoomNight.all
  end

  # GET /room_nights/1 or /room_nights/1.json
  def show
  end

  # GET /room_nights/new
  def new
    @room_night = RoomNight.new
  end

  # GET /room_nights/1/edit
  def edit
  end

  # POST /room_nights or /room_nights.json
  def create
    @room_night = RoomNight.new(room_night_params)

    respond_to do |format|
      if @room_night.save
        format.html { redirect_to @room_night, notice: "Room night was successfully created." }
        format.json { render :show, status: :created, location: @room_night }
      else
        format.html { render :new, status: :unprocessable_content }
        format.json { render json: @room_night.errors, status: :unprocessable_content }
      end
    end
  end

  # PATCH/PUT /room_nights/1 or /room_nights/1.json
  def update
    respond_to do |format|
      if @room_night.update(room_night_params)
        format.html { redirect_to @room_night, notice: "Room night was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @room_night }
      else
        format.html { render :edit, status: :unprocessable_content }
        format.json { render json: @room_night.errors, status: :unprocessable_content }
      end
    end
  end

  # DELETE /room_nights/1 or /room_nights/1.json
  def destroy
    @room_night.destroy!

    respond_to do |format|
      format.html { redirect_to room_nights_path, notice: "Room night was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room_night
      @room_night = RoomNight.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def room_night_params
      params.expect(room_night: [ :room_id, :booking_id, :date ])
    end
end
