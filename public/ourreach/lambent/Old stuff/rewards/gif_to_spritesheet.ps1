param($gifFile, $outFile);
magick convert -layers dispose $gifFile temp.gif
magick montage $gifFile -tile x1 -geometry '1x1+0+0<' -alpha On -background "rgba(0, 0, 0, 0.0)" -quality 100 $outFile
rm temp.gif;