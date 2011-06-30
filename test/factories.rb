# encoding: utf-8

FactoryGirl.define do
  factory :gig do
    name
    place 'Prague'
    time 1.month.since(Date.today)
  end
  
  sequence :name do |n|
    "concert#{n}"
  end
end