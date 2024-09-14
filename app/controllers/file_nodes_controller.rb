class FileNodesController < ApplicationController
  before_action :set_file_node, only: %i[ show details edit update destroy ]
  # GET /file_nodes or /file_nodes.json
  def index
    @file_nodes = FileNode.all
  end

  # GET /file_nodes/1 or /file_nodes/1.json
  def show
  end

  def details
  end

  # GET /file_nodes/new
  def new
    @file_node = FileNode.new
  end

  # GET /file_nodes/1/edit
  def edit
  end

  # POST /file_nodes or /file_nodes.json
  def create
    @file_node = FileNode.new(file_node_params)

    respond_to do |format|
      if @file_node.save
        format.html { redirect_to file_node_url(@file_node), notice: "File node was successfully created." }
        format.json { render :show, status: :created, location: @file_node }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @file_node.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /file_nodes/1 or /file_nodes/1.json
  def update
    respond_to do |format|
      if @file_node.update(file_node_params)
        format.html { redirect_to file_node_url(@file_node), notice: "File node was successfully updated." }
        format.json { render :show, status: :ok, location: @file_node }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @file_node.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /file_nodes/1 or /file_nodes/1.json
  def destroy
    @file_node.destroy!

    respond_to do |format|
      format.html { redirect_to file_nodes_url, notice: "File node was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_file_node
      @file_node = FileNode.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def file_node_params
      params.require(:file_node).permit(:name, :directory)
    end
end
