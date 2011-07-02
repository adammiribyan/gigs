# encoding: utf-8

FactoryGirl.define do
  factory :gig do
    name
    place 'Prague'
    time 1.month.since(Date.today)
  end
  
  factory :song do
    name 'My Secret friend'
    artist 'IAMX'
    weborama_url 'http://www.weborama.ru/#/music/IAMX/Kingdom_Of_Welcome_Addiction/My_Secret_Friend_Feat._Imogen_Heap/'
    lyrics 'my secret friend, oh take me to the river'
    chords_url 'http://www.google.com/'
    gig
  end
  
  sequence :name do |n|
    "concert#{n}"
  end
end