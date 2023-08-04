library(dplyr)
library(tidyverse)

df<-read.csv("C:/Users/ldr/Desktop/ÔŠ½›ÆªÄ¿Ö÷î}.csv")


df1_1<-df[,c(2,6)]
df1_2<-df[,c(5,6)]

jf1<-df1_1 %>% 
  group_by(Genre, Function) %>%
  summarise(value = n())

jf2<-df1_2 %>% 
  group_by(Function, Theme) %>%
  summarise(value = n())

colnames(jf1)<-c("source","target","value")
colnames(jf2)<-c("source","target","value")

jf1$source[jf1$source=='‡øïL']<-'ïL'

#1 gen-fun
df0_gen<-jf1 %>% group_by(source) %>%
  summarise(sum=sum(value))
df0_fun<-jf1 %>% 
  group_by(target) %>%
  summarise(sum=sum(value))

df0_gen[c('dy','height','rectWidth')]=0
df0_fun[c('dy','height','rectWidth')]=0
df5=df0_gen
df6=df0_fun
colnames(df5)[1]<-'node'
colnames(df6)[1]<-'node'

#2 fun-the
df0_the<-jf2 %>% 
  group_by(target) %>%
  summarise(sum=sum(value))

df0_the[c('dy','height','rectWidth')]=0
df7=df0_the
colnames(df7)[1]<-'node'



#parameter_all
left = 30; right = 30; top = 10; bottom = 10
width = 1400 - left - right
height = 600 - top - bottom
width1 = 700 #gen-fun
width2 = width - width1 + rectWidth2 #fun-the
#parameter_gen
rectWidth1 = 90
pad = 30
n1= length(df5$node)
amount = sum(df5$sum)
#unit = (height - (n1-1)*pad)/amount
col_gen = c("#C69480","#73747E","#48685B")

r=75; d=150
unit1 = d/max(df5$sum)

#parameter_fun
height2 = 5.6*height/8.5
rectWidth2 = 30
pad2 = 30
n2 = length(df6$node)
amount2 = sum(df6$sum)
unit2 = (height2 - (n2-1)*pad2)/amount2
col_fun = rep("#B2B3B7", n2) 

#parameter_the

height3 = height-10
rectWidth3 = 60
pad3 = 6
n3 = length(df7$node)
amount3 = sum(df7$sum)
unit3 = (height3 - (n3-1)*pad3)/amount3
col_the = rep("#A8B0AF", n3) 


#parameter_link
nodeName<-df6$node

##calculation_gen
order1<-c('ÑÅ','ïL','íž')
df5<-df5 %>%
  slice(match(order1, node))

#df5$dy[1]=top
df5['dr']<-0
for (i in 1:n1) {
  df5$height[i]<-unit1*df5$sum[i]
  df5$dr[i]<-sqrt(r^2-1/4*df5$height[i]^2)
}
df5$dr[1]^2+1/4*df5$height[1]^2 == r^2
sum(df5$height)
#for (i in 2:n1) {
 # df5$dy[i]<-df5$dy[i-1]+df5$height[i-1]+pad
#}

df5$dy[1]<-top+1/10*height
df5$dy[2]<-top+1/3*height
df5$dy[3]<-top+3/4*height

#df5$dy[n1]+df5$height[n1] == top+height #true?


df5['EngName']<-c('Odes and Epics','Songs','Hymns')
df5['dx']<-c(d,3/2*d,11/8*d)
df5['color']<-col_gen
df5['rectWidth']<-rectWidth1
df5['image']<-c('/data/ÑÅ.png','/data/·ç.png','/data/ËÌ.png')



##calculation_fun
order2<-c('Åd','Ó^','Èº','Ô¹')
df6<-df6 %>%
  slice(match(order2, node))

df6$dy[1]=top + 1.7*height/8.5

for (i in 1:n2) {
  df6$height[i]<-unit2*df6$sum[i]
}

sum(df6$height)
for (i in 2:n2) {
  df6$dy[i]<-df6$dy[i-1]+df6$height[i-1]+pad2
}

df6$dy[n2]+df6$height[n2] == top+height2+1.7*height/8.5 #true?


df6['EngName']<-c('Inspiration', 'Reflection', 'Communication', 'Complaint' )
df6['dx']<-rep(left+width1-rectWidth2,n2)
df6['color']<-col_fun
df6['rectWidth']<-rectWidth2

##calculation_the
order3<-c("ÇÚÕþ","‘ð Ž","ÑçðA","¼Àìë","ÖSÖG","íž¸è","Ù¸è","‘ÙÇú","×Ô‚û","ÃñË×","ýR¼Ò","µ¿Íö")
df7<-df7 %>%
  slice(match(order3, node))

df7$dy[1]=top+5

for (i in 1:n3) {
  df7$height[i]<-unit3*df7$sum[i]
}

sum(df7$height)

for (i in 2:n3) {
  df7$dy[i]<-df7$dy[i-1]+df7$height[i-1]+pad3
}

df7$dy[n3]+df7$height[n3] == top+height3+5 #true?


df7['EngName']<-c('Diligent-Governance','War','Feast','Fete','Sarcasm','Odes','Praise','Love-Song','Self-Sentimental','Folk-Custom','Family Regulating','Mourning')
df7['dx']<-rep(left+width-rectWidth3,n3)
df7['color']<-col_the
df7['rectWidth']<-rectWidth3

##combine
df8<-rbind(df5,df6,df7)

#LINK
jf1$source[jf1$source=='‡øïL']<-'ïL'

##link_gen

df_link0<-jf1 %>%
  group_by(source) %>%
  slice(match(order2, target))

df_link0[c('k1','k2','z1','z2','dx_k','color')]<-0


columns= colnames(df_link0)
df_link1 = data.frame(matrix(nrow = 0, ncol = length(columns))) 
colnames(df_link1) = columns

nodeName5<-df5$node
for (index in nodeName5) {
  df<-df_link0 %>%
    filter(source == index) 
  
  n<-length(df$source)
  
  j<-which(df5$node %in% index)#sum,height,dy
  sum<-df5$sum[j]
  dy<-df5$dy[j]
  height0<-df5$height[j]
  dx<-df5$dx[j]
  col_link = df5$color[j]
  df$k1[1]<-df5$dy[j]
  
  for (i in 1:n) {
    dk<-(df$value[i]/sum)*height0
    df$k2[i]<-df$k1[i]+dk
    df$dx_k[i]<-dx
    df$color[i]<-col_link
    
    if(i<n){
      df$k1[i+1]<-df$k2[i]
    }else{
      break
    }
  }
  
  
  df_link1<-rbind(df_link1, df)
  
}

##link_gen_left

df_link2<-df_link1 %>%
  group_by(target) %>%
  slice(match(order1, source))

df_link2['dx_z']<-0



columns1= colnames(df_link2)
df_link3 = data.frame(matrix(nrow = 0, ncol = length(columns1))) 
colnames(df_link3) = columns1

nodeName6<-df6$node
for (index in nodeName6) {
  df<-df_link2 %>%
    filter(target == index) 
  
  n<-length(df$target)
  
  j<-which(df6$node %in% index)#sum,height,dy
  sum<-df6$sum[j]
  dy<-df6$dy[j]
  height0<-df6$height[j]
  dx<-df6$dx[j]+rectWidth2/2

  
  df$z1[1]<-df6$dy[j]
  
  for (i in 1:n) {
    dz<-(df$value[i]/sum)*height0
    df$z2[i]<-df$z1[i]+dz
    df$dx_z[i]<-dx

    if(i<n){
      df$z1[i+1]<-df$z2[i]
    }else{
      break
    }
  }
  
  
  df_link3<-rbind(df_link3, df)
  
}

##link_fun-right

df_link4<-jf2 %>%
  group_by(source) %>%
  slice(match(order3, target))

df_link4[c('k1','k2','z1','z2','dx_k','color')]<-0


columns2= colnames(df_link4)
df_link5 = data.frame(matrix(nrow = 0, ncol = length(columns2))) 
colnames(df_link5) = columns2

nodeName6<-df6$node
for (index in nodeName6) {
  df<-df_link4 %>%
    filter(source == index) 
  
  n<-length(df$source)
  
  j<-which(df6$node %in% index)#sum,height,dy
  sum<-df6$sum[j]
  dy<-df6$dy[j]
  height0<-df6$height[j]
  dx<-df6$dx[j]+rectWidth2/2
  col_link = df6$color[j]
  df$k1[1]<-df6$dy[j]
  
  for (i in 1:n) {
    dk<-(df$value[i]/sum)*height0
    df$k2[i]<-df$k1[i]+dk
    df$dx_k[i]<-dx
    df$color[i]<-col_link
    
    if(i<n){
      df$k1[i+1]<-df$k2[i]
    }else{
      break
    }
  }
  
  
  df_link5<-rbind(df_link5, df)
  
}

##link_the

df_link6<-df_link5 %>%
  group_by(target) %>%
  slice(match(order2, source))

df_link6['dx_z']<-0



columns3= colnames(df_link6)
df_link7 = data.frame(matrix(nrow = 0, ncol = length(columns3))) 
colnames(df_link7) = columns3

nodeName7<-df7$node
for (index in nodeName7) {
  df<-df_link6 %>%
    filter(target == index) 
  
  n<-length(df$target)
  
  j<-which(df7$node %in% index)#sum,height,dy
  sum<-df7$sum[j]
  dy<-df7$dy[j]
  height0<-df7$height[j]
  dx<-df7$dx[j]+rectWidth3/2
  
  
  df$z1[1]<-df7$dy[j]
  
  for (i in 1:n) {
    dz<-(df$value[i]/sum)*height0
    df$z2[i]<-df$z1[i]+dz
    df$dx_z[i]<-dx

    if(i<n){
      df$z1[i+1]<-df$z2[i]
    }else{
      break
    }
  }
  
  
  df_link7<-rbind(df_link7, df)
  
}

df_link3['opacity']<-0.15
df_link7['opacity']<-0.2

df_link8<-rbind(df_link3,df_link7)

write.csv(df_link8,"C:/Users/ldr/Desktop/links2.csv", row.names = F)
#separate node
write.csv(df5,"C:/Users/ldr/Desktop/node_gen.csv", row.names = F)
write.csv(df6,"C:/Users/ldr/Desktop/node_fun.csv", row.names = F)
write.csv(df7,"C:/Users/ldr/Desktop/node_the.csv", row.names = F)



write.csv(df_link3,"C:/Users/ldr/Desktop/links_gen_fun.csv", row.names = F)
write.csv(df_link7,"C:/Users/ldr/Desktop/links_fun_the.csv", row.names = F)
write.csv(df8, "C:/Users/ldr/Desktop/gen_fun_the.csv", row.names = F)