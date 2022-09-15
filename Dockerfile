FROM osgeo/gdal:ubuntu-small-3.4.0
RUN apt update \
&& apt upgrade -y \
&& apt install -y \
gdal-bin \
git \
libgdal-dev \
libproj-dev \
pdal \
ruby \
sqlite3 \
automake \
cmake \
g++ \
&& git clone https://github.com/mapbox/tippecanoe \
&& cd tippecanoe \
&& make -j3 LDFLAGS="-latomic" \
&& make install \
&& cd .. \
