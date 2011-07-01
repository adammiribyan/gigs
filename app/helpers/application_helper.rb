# encoding: utf-8

module ApplicationHelper
  def title(page_title)
    content_for(:title) { page_title }
  end
  
  def link_to_home
    unless controller.action_name == "index" and controller.controller_name == "gigs"
      "<div id=\"home\">#{link_to('↑↑↑', root_path)}</div>".html_safe
    end
  end
end
