library(dplyr)
library(tidyverse)
library(scales)
library(data.table)

##function to change the order to a "pyramid"
makeTent = function(ints) {
  ints_o = ints[order(ints)]
  if((length(ints) %% 2) == 0) {
    # even number of observations
    ints_tent = c(ints_o[seq.int(from = 1, to = (length(ints) - 1), by = 2)],
                  rev(ints_o[seq.int(from = 2, to = length(ints), by = 2)]))
  } else {
    # odd number of observations
    ints_tent = c(ints_o[seq.int(from = 2, to = (length(ints) - 1), by = 2)],
                  rev(ints_o[seq.int(from = 1, to = length(ints), by = 2)]))
  }
  return(ints_tent)
}

###import data
df_sh<-read.csv("D:/A李杜若/留学/科研/可视化_王懿芳学姐/Book of Songs/data/glyph/glyph_螣.csv")
df_sh<-df_sh[,c(4,7,8,10)]
colnames(df_sh)<-c("Genre","Theme","Function","Emotion")

###parameter
R<-100
gap<-(2/180)*pi
op0<-0.7
u<-1/9

##Emo

df_sh1<-df_sh %>% 
  group_by(Emotion) %>%
  summarise(n1=n()) %>%
  mutate(r=n1/sum(n1)) %>%
  arrange(n1) %>%
  mutate(id = row_number())

order<-makeTent(df_sh1$id)

df_sh1<-df_sh1 %>%
  slice(match(order, id))

df_sh1<-df_sh1[,1:length(df_sh1)-1]

##opacity
df_sh1$op<-op0

##fill
#fill_id
col_id<-data.frame(matrix(nrow = 8, ncol = 1))
colnames(col_id)<-c('fill')
col_id$fill<- c("#D7955B","#DAA36C","#E7C59D","#ECE3C1","#C3C8BA","#93A49E","#638083","#3D646E")
rownames(col_id)<-c('爱','喜','欲','中性','惧','哀','怒','恶')

for (i in 1:n1) {
  df_sh1$fill[i]<-col_id[df_sh1$Emotion[i],]
}

df_sh1[c('a1','a2','height','r2','r1')]<-0


n1<-length(df_sh1$r)
A1<-4/3*pi-(n1-1)*gap

df_sh1$a1[1]<-0
df_sh1['r2']<-R

for (i in 2:n1) {
  df_sh1$a1[i]<-df_sh1$a1[i-1]+df_sh1$r[i-1]*A1+gap
}
for (i in 1:n1) {
  df_sh1$a2[i]<-df_sh1$a1[i]+df_sh1$r[i]*A1
}
df_sh1$a2[n1]==4/3*pi

####################HEIGHT

R1<-(u*R/2)/df_sh1$r[3]

###########################
for (i in 1:n1) {
  df_sh1$height[i]<-df_sh1$r[i]*R1
  df_sh1$r1[i]<-df_sh1$r2[i]-df_sh1$height[i]
}



##The
df_sh2<- df_sh %>% 
  group_by(Emotion, Theme) %>%  #group by multiple columns
  summarise(n2=n())  %>%
  mutate(r=n2/sum(n2)) 
#%>% mutate(id=row_number()) 


df_sh2$op<-rescale(df_sh2$n2, to = c(0.7,1))#scale to certain range for not so little opacity


df_sh2['fill']<-'#A8B0AF'
df_sh2[c('a1','a2','height','r2','r1')]<-0

#create new df to combine reconstructed sub
columns= colnames(df_sh2)
df_sh21 = data.frame(matrix(nrow = 0, ncol = length(columns))) 
colnames(df_sh21) = columns

id_emo<-df_sh1$Emotion
for (i in id_emo) {
  df<-df_sh2 %>%
    filter(Emotion==i)
  
  if(length(df$n2)>=3){
    df<- df %>% 
      arrange(n2) %>%
      mutate(id = row_number())
    
    order<-makeTent(df$id)
    df<-df %>%
      slice(match(order, id))
    
    df<-df[,1:length(df)-1]
  } 
  
  f<-which(df_sh1$Emotion %in% i)
  A0<-df_sh1$a1[f]
  A<-df_sh1$a2[f]-df_sh1$a1[f]
  h<-df_sh1$height[f]
  df$r2<-df_sh1$r1[f]
  
  n<-length(df$Theme)
  
  df$a1[1]<-A0
  if(n>=2){
    for (k in 2:n) {
      df$a1[k]<-df$a1[k-1]+df$r[k-1]*A
    }
  }
  
  for (k in 1:n) {
    df$a2[k]<-df$a1[k]+df$r[k]*A
  }
  
  for(k in 1:n){
    df$height[k]<-h*df$r[k]
    df$r1[k]<-df$r2[k]-df$height[k]
  }
  
  
  df_sh21<-rbind(df_sh21,df)  
}



##Fun
df_sh3<-df_sh %>% 
  group_by(Emotion, Theme, Function) %>%  #group by multiple columns
  summarise(n3=n()) %>%
  mutate(r=n3/sum(n3))

df_sh3$op<-rescale(df_sh3$n3, to = c(0.7,1))#scale to certain range for not so little opacity

df_sh3['fill']<-'#B2B3B7'
df_sh3[c('a1','a2','height','r2','r1')]<-0


#create new df to combine reconstructed sub
columns= colnames(df_sh3)
df_sh31 = data.frame(matrix(nrow = 0, ncol = length(columns))) 
colnames(df_sh31) = columns

id_the<-unique(df_sh21$Theme)

for (i in id_emo) {
  for (j in id_the) {
    df<-df_sh3 %>%
      filter((Emotion==i)&(Theme==j))
    
    if(length(df$n3)>=3){
      df<- df %>% 
        arrange(n3) %>%
        mutate(id = row_number())
      
      order<-makeTent(df$id)
      df<-df %>%
        slice(match(order, id))
      
      df<-df[,1:length(df)-1]
    } 
    
    f<-which((df_sh21$Emotion %in% i)&(df_sh21$Theme %in% j))
    A0<-df_sh21$a1[f]
    A<-df_sh21$a2[f]-df_sh21$a1[f]
    h<-df_sh21$height[f]
    df$r2<-df_sh21$r1[f]
    
    n<-length(df$Function)
    
    df$a1[1]<-A0
    
    if(n>=2){
      for (k in 2:n) {
        df$a1[k]<-df$a1[k-1]+df$r[k-1]*A
      }
    }
    
    for (k in 1:n) {
      df$a2[k]<-df$a1[k]+df$r[k]*A
    }
    
    for(k in 1:n){
      df$height[k]<-h*df$r[k]
      df$r1[k]<-df$r2[k]-df$height[k]
    }
    
    
    df_sh31<-rbind(df_sh31,df) 
    
  }
}

##Gen
df_sh4<-df_sh %>%
  group_by(Emotion, Theme, Function, Genre) %>%  #group by multiple columns
  summarise(n4=n()) %>%
  mutate(r=n4/sum(n4))

##opacity
df_sh4$op<-op0

##fill
fill_list<-c('#73747E','#C69480','#48685B')
name<-c('国风','雅','颂')

#fill color
for (i in 1:3) {
  df_sh4$fill[df_sh4$Genre==name[i]]<-fill_list[i]
}


df_sh4[c('a1','a2','height','r2','r1')]<-0

#create new df to combine reconstructed sub
columns= colnames(df_sh4)
df_sh41 = data.frame(matrix(nrow = 0, ncol = length(columns))) 
colnames(df_sh41) = columns

id_fun<-unique(df_sh31$Function)
for (i in id_emo) {
  for (j in id_the) {
    for (t in id_fun) {
      
      df<-df_sh4 %>%
        filter((Emotion==i)&(Theme==j)&(Function==t))
      
      if(length(df$n4)>=3){
        df<- df %>% 
          arrange(n4) %>%
          mutate(id = row_number())
        
        order<-makeTent(df$id)
        df<-df %>%
          slice(match(order, id))
        
        df<-df[,1:length(df)-1]
      } 
      
      f<-which((df_sh31$Emotion %in% i)&(df_sh31$Theme %in% j)&(df_sh31$Function %in% t))
      A0<-df_sh31$a1[f]
      A<-df_sh31$a2[f]-df_sh31$a1[f]
      h<-df_sh31$height[f]
      df$r2<-df_sh31$r1[f]
      
      n<-length(df$Function)
      
      df$a1[1]<-A0
      
      if(n>=2){
        for (k in 2:n) {
          df$a1[k]<-df$a1[k-1]+df$r[k-1]*A
        }
      }
      
      for (k in 1:n) {
        df$a2[k]<-df$a1[k]+df$r[k]*A
      }
      
      for(k in 1:n){
        df$height[k]<-h*df$r[k]
        df$r1[k]<-df$r2[k]-df$height[k]
      }
      
      
      df_sh41<-rbind(df_sh41,df) 
      
    }
  }
}

##rbind
list<-c('r','op','fill','a1','a2','height','r2','r1')

df_sh_all<-rbind(df_sh1[list],df_sh21[list],df_sh31[list],df_sh41[list])

write.csv(df_sh_all,"C:/Users/ldr/Desktop/data/glyph/react_glyph/glyph_螣.csv", row.names = F)

############end###########

##image_螣
img_sh = data.frame(matrix(nrow = 5, ncol = 6))

colnames(img_sh)<-c('name','n','a1','a2','r','ratio')

img_sh$name<-c('棘','穀','贼','马','蟊')
img_sh$n<-c(3,3,6,5,4) #3->2

img_sh<-img_sh %>%
  mutate(ratio=n/sum(n))

n<-length(img_sh$name)
A<-2/3*pi-(n+1)*gap

img_sh$a1[1]<-2*pi-gap

for (i in 2:n) {
  img_sh$a1[i]<-img_sh$a1[i-1]-A*img_sh$ratio[i-1]-gap
}

for (i in 1:n) {
  img_sh$a2[i]<-img_sh$a1[i]-A*img_sh$ratio[i]
}

for (i in 1:n) {
  img_sh$r[i]<-sin(1/4*A*img_sh$ratio[i])*R*2
}


###output
#relate
write.csv(img_sh,"C:/Users/ldr/Desktop/data/glyph/react_glyph/relate_t.csv", row.names = F)
