class PagesController < ApplicationController
  def home
    if user_signed_in? == false
      redirect_to new_user_session_path
    end
  end

  def mode_select
  end
end
