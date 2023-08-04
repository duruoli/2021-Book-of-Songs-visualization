library(dplyr)
library(tidyverse)

df<-read.csv("C:/Users/ldr/Desktop/詩經篇目主題.csv")

df_all<-df[,c(2,3)]
df_all$Genre[df_all$Genre == '國風']<-"風"

#國風
df_f<-df_all %>%
  filter(Genre == '風')

df_f<-df_f %>%
  group_by(Location) %>%
  summarise(n = n()) %>%
  arrange(desc(n), by_group = T)
colnames(df_f)[1]<-'section'

n_f<-length(df_f$section)
o1=1
o2=0.2
unit<-(o1-o2)/(df_f$n[1]-df_f$n[n_f])


df_f[c('a1','a2','opacity')]<-0

df_f$a1[1]<-0

for (i in 2:n_f) {
  da<-df_f$n[i-1]/sum(df_f$n)*pi
  df_f$a1[i]<-da+df_f$a1[i-1]
}

for (i in 1:n_f) {
  da<-df_f$n[i]/sum(df_f$n)*pi
  df_f$a2[i]<-df_f$a1[i]+da
  df_f$opacity[i]<-o2+(df_f$n[i]-df_f$n[n_f])*unit
}



#雅
##section
columns= colnames(df_f)
df_y1 = data.frame(matrix(nrow = 2, ncol = length(columns))) 
colnames(df_y1) = columns

df_y1['section']<-c('小雅','大雅')
df_y1['n']<-c(74,31)


n_y1<-length(df_f$section)
o1=0.6
o2=0.3

df_y1$a1[1]<-0
df_y1$a2[1]<-74/105*pi
df_y1$a1[2]<-74/105*pi
df_y1$a2[2]<-pi

df_y1$opacity<-c(o1,o2)

##subsection
df_y2<-df_all %>%
  filter(Genre == '雅')
colnames(df_y2)[2]<-'subsection'

df_y21<-head(df_y2, n=74L)
df_y22<-tail(df_y2, n=31L)

df_y21<-df_y21 %>%
  group_by(subsection) %>%
  summarise(n = n()) %>%
  arrange(desc(n))

df_y21[c('a1','a2','opacity')]<-0

df_y21$a1[1]<-0
df_y21$opacity<-o1

df_y22<-df_y22 %>%
  group_by(subsection) %>%
  summarise(n = n()) %>%
  arrange(desc(n))
df_y22[c('a1','a2','opacity')]<-0
df_y22$opacity<-o2

df_y2<-rbind(df_y21,df_y22)

n_y2<-length(df_y2$n)

for (i in 2:n_y2) {
  da<-df_y2$n[i-1]/sum(df_y2$n)*pi
  df_y2$a1[i]<-da+df_y2$a1[i-1]
}

for (i in 1:n_y2) {
  da<-df_y2$n[i]/sum(df_y2$n)*pi
  df_y2$a2[i]<-df_y2$a1[i]+da
}

#颂
##section
columns= colnames(df_f)
df_s1 = data.frame(matrix(nrow = 3, ncol = length(columns))) 
colnames(df_s1) = columns

df_s1['section']<-c('周','商','鲁')
df_s1['n']<-c(31,5,4)


n_s1<-length(df_s1$section)
o1=0.5
o2=0.4/27+0.1
o3=0.1

df_s1$a1[1]<-0
df_s1$a2[1]<-31/40*pi
df_s1$a1[2]<-31/40*pi
df_s1$a2[2]<-36/40*pi
df_s1$a1[3]<-36/40*pi
df_s1$a2[3]<-pi

df_s1$opacity<-c(o1,o2,o3)

##subsection
df_s2<-df_all %>%
  filter(Location == '周頌')
colnames(df_s2)[2]<-'section'
df_s2['subsection']<-0
df_s2$subsection[1:10]<-'清廟之什'
df_s2$subsection[11:20]<-'臣工之什'
df_s2$subsection[21:31]<-'閔予小子之什'


df_s2<-df_s2 %>%
  group_by(subsection) %>%
  summarise(n = n()) %>%
  arrange(desc(n))

df_s2[c('a1','a2','opacity')]<-0

df_s2$a1[1]<-0
df_s2$opacity<-o1

n_s2<-length(df_s2$n)

for (i in 2:n_s2) {
  da<-df_s2$n[i-1]/sum(df_s2$n)*31/40*pi
  df_s2$a1[i]<-da+df_s2$a1[i-1]
}

for (i in 1:n_s2) {
  da<-df_s2$n[i]/sum(df_s2$n)*31/40*pi
  df_s2$a2[i]<-df_s2$a1[i]+da
}

#cx cy
df_f['cx']<-df5$dx[2]-df5$dr[2]
df_f['cy']<-df5$dy[2]+df5$height[2]/2
df_y1['cx']<-df5$dx[1]-df5$dr[1]
df_y1['cy']<-df5$dy[1]+df5$height[1]/2
df_y2['cx']<-df5$dx[1]-df5$dr[1]
df_y2['cy']<-df5$dy[1]+df5$height[1]/2
df_s1['cx']<-df5$dx[3]-df5$dr[3]
df_s1['cy']<-df5$dy[3]+df5$height[3]/2
df_s2['cx']<-df5$dx[3]-df5$dr[3]
df_s2['cy']<-df5$dy[3]+df5$height[3]/2
#输出
write.csv(df_f,"C:/Users/ldr/Desktop/f_sec.csv", row.names = F)
write.csv(df_y1,"C:/Users/ldr/Desktop/y_sec.csv", row.names = F)
write.csv(df_y2,"C:/Users/ldr/Desktop/y_sub.csv", row.names = F)
write.csv(df_s1,"C:/Users/ldr/Desktop/s_sec.csv", row.names = F)
write.csv(df_s2,"C:/Users/ldr/Desktop/s_sub.csv", row.names = F)