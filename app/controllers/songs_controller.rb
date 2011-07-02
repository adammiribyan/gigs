class SongsController < ApplicationController
  before_filter :obtain_gig, except: [:edit, :update, :destroy]
  
  def index
    @songs = @gig.songs.all
  end

  def show
    @song = Song.find(params[:id])
  end

  def new
    @song = @gig.songs.new
  end

  def edit
    @song = Song.find(params[:id])
  end

  def create
    @song = @gig.songs.new(params[:song])
    
    if @song.save
      redirect_to(@song, notice: t(:success, scope: [:songs, :create]))
    else
      render action: "new"
    end
  end

  def update
    @song = Song.find(params[:id])
    
    if @song.update_attributes(params[:song])
      redirect_to(@song, notice: t(:success, scope: [:songs, :update]))
    else
      render action: "edit"
    end
  end

  def destroy
    @song = Song.find(params[:id])
    
    if @song.destroy
      redirect_to @song.gig
    end
  end
  
  private
  
    def obtain_gig
      if params[:gig_id].present?
        @gig = Gig.find_by_id(params[:gig_id])
      else
        @gig = Song.find_by_id(params[:id]).gig
      end
    end
end
