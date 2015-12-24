library(tidyr)
library(ggplot2)
library(gdata)

setwd("~/Code/un-viz-2016/data")

data_m <-read.csv("education-m.csv", header = T)
data_f <-read.csv("education-f.csv", header = T)

data_m <- na.omit(data_m)
data_f <- na.omit(data_f)


write.csv(data_m, "~/Desktop/cleanm.csv")
write.csv(data_f, "~/Desktop/cleanf.csv")

#Let's do a quick plot
#ggplot(data_long, aes(x=Year, y=Value))+geom_jitter(alpha=I(1/3), color="slategray4")+geom_smooth(method="lm")

#p <- qplot (Year, Value, data = data)
