library(tidyr)
library(ggplot2)

data <-read.csv(file.choose(), header = T) # choose the long data


str(data)

#write.csv(data_long, "~/Desktop/output.csv")

#Let's do a quick plot
#ggplot(data_long, aes(x=Year, y=Value))+geom_jitter(alpha=I(1/3), color="slategray4")+geom_smooth(method="lm")

#p <- qplot ()#