library(tidyr)
library(ggplot2)
library(gdata)

filename <- "education-m.csv"
data <-read.csv(paste("~/Code/un-viz-2016/data/", filename, sep='') , header = T) # choose the long data

str(data)

#write.csv(data_long, "~/Desktop/output.csv")

model <- lm(Value ~ Year, data = data)
coef(model)
intercept <- 1983.3630
slope <- 0.1534 

#Let's do a quick plot
#ggplot(data_long, aes(x=Year, y=Value))+geom_jitter(alpha=I(1/3), color="slategray4")+geom_smooth(method="lm")

p <- qplot (Year, Value, data = data)
p + geom_abline(intercept = intercept, slope = slope, colour = "red", size = 2)

