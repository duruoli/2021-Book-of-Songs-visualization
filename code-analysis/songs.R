library(dplyr)
library(tidyverse)

df<-read.csv("C:/Users/ldr/Desktop/瑭╃稉绡囩洰涓婚.csv")

df2<-df[,c(1,8,9)]
df1_1<-df[,c(2,6)]
df1_2<-df[,c(5,6)]

j2_1<-df1_1 %>% 
  group_by(Genre, Function) %>%
  summarise(value = n())

j2_2<-df1_2 %>% 
  group_by(Function, Theme) %>%
  summarise(value = n())



j1<-df2 %>% 
  group_by(Emotion, Rhetoric) %>%
  summarise(value = n())

df0<-read.csv("D:/A李杜若/留学/科研/可视化_王懿芳学姐/Book of Songs/data/EmoRhe.csv")

df0_emo<-df0 %>% group_by(source) %>%
  summarise(sum=sum(value))
df0_rhe<-df0 %>% 
  group_by(target) %>%
  summarise(sum=sum(value))

df0_emo[c('dy','height')]=0
df0_rhe[c('dy','height')]=0
df5=df0_emo
df6=df0_rhe
colnames(df5)[1]<-'node'
colnames(df6)[1]<-'node'

#parameter_emo
left = 30; right = 30; top = 10; bottom = 10
width = 496.515679 - left - right
height = 600 - top - bottom#height':width'=287:216
rectWidth = 30
pad = 10
n1= length(df5$node)
amount = sum(df5$sum)
unit = (height - (n1-1)*pad)/amount
col_emo = c("#D7955B","#DAA36C","#E7C59D","#ECE3C1","#C3C8BA","#93A49E","#638083","#3D646E")

#parameter_rhe
height2 = 2*height/3
pad2 = 10
n2 = length(df6$node)
amount2 = sum(df6$sum)
unit2 = (height2 - (n2-1)*pad2)/amount2
col_rhe = rep("#9CA7AF", 3) 

#parameter_link
nodeName<-df6$node


##calculation_rhe
order2<-c('赋','比','兴')
df6<-df6 %>%
  slice(match(order2, node))
df6$dy[1]=top + height/6

for (i in 1:n2) {
  df6$height[i]<-unit2*df6$sum[i]
}

sum(df6$height)
for (i in 2:n2) {
  df6$dy[i]<-df6$dy[i-1]+df6$height[i-1]+pad2
}

df6$dy[n2]+df6$height[n2] == top+height2+height/6 #true?


df6['EngName']<-c('Narration', 'Simile', 'Borrowed Analogy' )
df6['dx']<-rep(left+width-rectWidth,n2)
df6['color']<-col_rhe

###link_rhe
df_link0<-df0 %>%
  group_by(target) %>%
  slice(match(order1, source))

df_link0[c('z1','z2','k1','k2','dx_z')]<-0


columns= colnames(df_link0)
df_link1 = data.frame(matrix(nrow = 0, ncol = length(columns))) 
colnames(df_link1) = columns

nodeName<-df6$node
for (index in nodeName) {
  df<-df_link0 %>%
    filter(target == index) 
  
  n<-length(df$source)
  
  j<-which(df6$node %in% index)#sum,height,dy
  sum<-df6$sum[j]
  dy<-df6$dy[j]
  height0<-df6$height[j]
  dx<-df6$dx[j]+rectWidth/2
  
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
  

  df_link1<-rbind(df_link1, df)
  
}




##calculation_emo
order1<-c("愛","喜","欲","中性","懼","哀","怒","惡")
df5<-df5 %>%
  slice(match(order1, node))
df5$dy[1]=top

for (i in 1:n1) {
  df5$height[i]<-unit*df5$sum[i]
}

sum(df5$height)
for (i in 2:n1) {
  df5$dy[i]<-df5$dy[i-1]+df5$height[i-1]+pad
}

df5$dy[n1]+df5$height[n1] == top+height #true?


df5['EngName']<-c('Love','Like','Desire','Neutral','Fear','Depress','Anger','Hate')
df5['dx']<-rep(left,n1)
df5['color']<-col_emo

##combine emo & rhe
df7<-rbind(df5,df6)

### link_emo

df_link2<-df_link1 %>%
  group_by(source) %>%
  slice(match(order2, target))

df_link2['dx_k']<-0
df_link2['color']<-0


columns1= colnames(df_link2)
df_link3 = data.frame(matrix(nrow = 0, ncol = length(columns1))) 
colnames(df_link3) = columns1

nodeName1<-df5$node
for (index in nodeName1) {
  df<-df_link2 %>%
    filter(source == index) 
  
  n<-length(df$source)
  
  j<-which(df5$node %in% index)#sum,height,dy
  sum<-df5$sum[j]
  dy<-df5$dy[j]
  height0<-df5$height[j]
  dx<-df5$dx[j]+rectWidth/2
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
  
  
  df_link3<-rbind(df_link3, df)
  
}


## output
write.csv(df_link3,"C:/Users/ldr/Desktop/links.csv", row.names = F)
write.csv(df7,"C:/Users/ldr/Desktop/emo_rhe.csv", row.names = F)
write.csv(df5,"C:/Users/ldr/Desktop/emo_sum.csv", row.names = F)
write.csv(df6,"C:/Users/ldr/Desktop/rhe_sum.csv", row.names = F)

write.csv(df0_rhe,"C:/Users/ldr/Desktop/rhe_sum.csv")