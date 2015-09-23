library(tidyr)
library(ggplot2)

data_child <-read.csv("/Users/albertocairo/Desktop/1R_HTML_CSS_JS/R/childMortality/ChildMortality.csv", header = T)
str(data_original)

data_child_long <- reshape(data_child, direction="long", varying=list(names(data_child)[5:59]), v.names="Score", 
                     idvar=c("Country"), timevar="Year", times=1961:2015)
data_child_long

write.csv(data_long, "/Users/albertocairo/Desktop/1R_HTML_CSS_JS/R/childMortality/2DataLongFormat.csv")

#let's create a VIOLIN PLOT! with relative densities
ggplot(data_child_long, aes(x = Score)) +
  stat_density(aes(ymax = ..density..,  ymin = -..density..),
               fill = "grey50", colour = "grey50",
               geom = "ribbon", position = "identity")+
  facet_grid(. ~ Year) +
  coord_flip()

#Let's do a JITTER PLOT!
ggplot(data_child_long, aes(x=Year, y=Score))+geom_jitter(alpha=I(1/3), color="slategray4")+geom_smooth(se=FALSE)
