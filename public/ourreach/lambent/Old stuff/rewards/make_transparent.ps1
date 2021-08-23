param($pngFile, $outFile);
magick convert $pngFile -fuzz 40% -transparent "#ffffff" $outFile