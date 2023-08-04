#in order to transfer the csv file into proper format for javascript
##image
df_image<-read.csv("C:/Users/ldr/Desktop/data/glyph/glyph_image.csv")
df_image$dir

write.csv(df_image,"C:/Users/ldr/Desktop/data/glyph/react_glyph/glyph_image.csv", row.names = F)
