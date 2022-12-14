require './constants'
require 'yaml'
require 'json'

z = ENV['Z'].to_i
#minzoom = (z == MINZOOM) ?  z : MINCOPYZOOM 
minzoom = (z == MINZOOM) ?  MINCOPYZOOM  : z
maxzoom = z
spacing = (BASE ** (Z_ONE_METER - z)).to_f
n = 0

first = true
start_time = Time.now
while gets
  if first
    first = false
    next
  else
    n += 1
  end
  r = $_.strip.split(',')
  x = r[0].to_f - r[0].to_f % spacing
  y = r[1].to_f - r[1].to_f % spacing
  h = r[2].to_f - r[2].to_f % spacing
  h = h.to_i
  color = '#' + r[13..15].map{|v| sprintf('%01x', v.to_i )}.join
  g = <<-EOS
type: Polygon
coordinates: 
  -
    -
      - #{x}
      - #{y}
    -
      - #{x + spacing}
      - #{y}
    -
      - #{x + spacing}
      - #{y + spacing}
    -
      - #{x}
      - #{y + spacing}
    -
      - #{x}
      - #{y}
  EOS
  g = YAML.load(g)
  f = <<-EOS
type: Feature
properties: 
  color: '#{color}'
  h: #{h}
  spacing: #{spacing}
tippecanoe:
  minzoom: #{minzoom}
  maxzoom: #{maxzoom}
  layer: #{LAYER}
  EOS
  f = YAML.load(f)
  f[:geometry] = g
  print JSON.dump(f), "\n"
end

def hms(s)
  min, sec = s.to_i.divmod(60)
  hour, min = min.divmod(60)
  "%02d:%02d:%02d" % [hour, min, sec]
end

$stderr.print "\n[#{z}] #{hms(Time.now - start_time)}s\n"