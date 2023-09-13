class AddImageurlToBadges < ActiveRecord::Migration[7.0]
  def change
    add_column :badges, :image_url, :string
  end
end
