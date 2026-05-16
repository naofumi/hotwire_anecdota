class MembershipsController < ApplicationController
  set_available_variants :server_validation, :client_validation
  before_action :set_membership, only: [ :show, :edit, :update, :destroy ]

  # GET /memberships or /memberships.json
  def index
    @memberships = Membership.all
  end

  # GET /memberships/1 or /memberships/1.json
  def show
  end

  # GET /memberships/new
  def new
    @membership = Membership.new
  end

  # GET /memberships/1/edit
  def edit
  end

  # POST /memberships or /memberships.json
  def create
    @membership = Membership.new(membership_params)

    respond_to do |format|
      if @membership.save
        format.html { redirect_to @membership, notice: "Membership was successfully created." }
        format.json { render :show, status: :created, location: @membership }
      else
        format.html { render :new, status: :unprocessable_content }
        format.json { render json: @membership.errors, status: :unprocessable_content }
      end
    end
  end

  # PATCH/PUT /memberships/1 or /memberships/1.json
  def update
    respond_to do |format|
      if @membership.update(membership_params)
        format.html { redirect_to @membership, notice: "Membership was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @membership }
      else
        format.html { render :edit, status: :unprocessable_content }
        format.json { render json: @membership.errors, status: :unprocessable_content }
      end
    end
  end

  # DELETE /memberships/1 or /memberships/1.json
  def destroy
    @membership.destroy!

    respond_to do |format|
      format.html { redirect_to memberships_path, notice: "Membership was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_membership
      @membership = Membership.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def membership_params
      params.expect(membership: [ :name, :email, :membership_type, :company_name, :valid_from, :valid_to ])
    end
end
