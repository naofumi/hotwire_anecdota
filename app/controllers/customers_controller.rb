class CustomersController < ApplicationController
  before_action :set_customer, only: %i[ show edit update ]

  # GET /customers or /customers.json
  def index
    sleep 1
    @customers = Customer.search(params[:query])
  end

  # GET /customers/1/edit
  def edit
  end

  # PATCH/PUT /customers/1 or /customers/1.json
  def update
    sleep 1

    respond_to do |format|
      if @customer.update(customer_params)
        format.html { redirect_to Customer, notice: "Customer was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_content }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_customer
      @customer = Customer.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def customer_params
      params.require(:customer).permit(:name, :jp_name)
    end
end
