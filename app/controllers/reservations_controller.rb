class ReservationsController < ApplicationController
  before_action :set_reservation, only: [ :show, :edit, :update, :destroy ]

  # GET /reservations or /reservations.json
  def index
    @reservations = Reservation.all
  end

  # GET /reservations/1 or /reservations/1.json
  def show
  end

  # GET /reservations/new
  def new
    @reservation = Reservation.new
  end

  # GET /reservations/1/edit
  def edit
  end

  # POST /reservations or /reservations.json
  def create
    @reservation = Reservation.new(reservation_params)

    if params[:confirmed]
      respond_to do |format|
        if @reservation.save
          format.html { redirect_to @reservation, notice: "Reservation was successfully created." }
          format.json { render :show, status: :created, location: @reservation }
        else
          format.html { render :new, status: :unprocessable_content }
          format.json { render json: @reservation.errors, status: :unprocessable_content }
        end
      end
    else
      render :confirm, status: :unprocessable_content
    end
  end

  # PATCH/PUT /reservations/1 or /reservations/1.json
  def update
    if params[:confirmed]
      respond_to do |format|
        if @reservation.update(reservation_params)
          format.html { redirect_to @reservation, notice: "Reservation was successfully updated.", status: :see_other }
          format.json { render :show, status: :ok, location: @reservation }
        else
          format.html { render :edit, status: :unprocessable_content }
          format.json { render json: @reservation.errors, status: :unprocessable_content }
        end
      end
    else
      @reservation.assign_attributes(reservation_params)
      if @reservation.valid? && !params[:review]
        render :confirm, status: :unprocessable_content
      else
        render :edit, status: :unprocessable_content
      end
    end
  end

  # DELETE /reservations/1 or /reservations/1.json
  def destroy
    @reservation.destroy!

    respond_to do |format|
      format.html {
        redirect_to reservations_path, notice: "Reservation was successfully destroyed.", status: :see_other
      }
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_reservation
      @reservation = Reservation.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def reservation_params
      params.expect(reservation: [ :guest_name, :guest_phone, :check_in, :check_out, :requested_room_id ])
    end
end
