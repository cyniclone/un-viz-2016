library(tidyr)
library(ggplot2)
library(gdata)

filename <- "partnerships.csv"
data <-read.csv(paste("~/Code/un-viz-2016/data/", filename, sep='') , header = T) # choose the long data

#write.csv(data_long, "~/Desktop/output.csv")

model <- lm(Value ~ Year, data = data)
coef(model)
intercept <- 321.3985181 
slope <- -0.1411941

#Let's do a quick plot
#ggplot(data_long, aes(x=Year, y=Value))+geom_jitter(alpha=I(1/3), color="slategray4")+geom_smooth(method="lm")

p <- qplot (Year, Value, data = data, alpha = 0.3)
p + geom_abline(intercept = intercept, slope = slope, colour = "blue", size = 2)

