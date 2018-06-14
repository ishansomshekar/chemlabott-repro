# Data wrangling in R
# Created by jdegen on Sep 17, 2016
# Modified by jdegen on May 11, 2018

library(tidyverse)
library(lme4)
library(languageR)
install.packages("bootstrap")
source("helpers.R")

# Load datasets. R will automatically read the contents of these files into data.frames.

dataset = read.csv("chemlabott_cleaned.csv")
head(dataset)
#wordinfo = read.csv("data/wordinfo.csv")
#head(wordinfo)


table(dataset$strong_response_bool)
prop.table(table(dataset$strong_response_bool))

table(dataset[,c("prime_strength","strong_response_bool")])
prop.table(table(dataset[,c("prime_strength","strong_response_bool")]),mar=c(1))

aggr = dataset %>% 
  group_by(prime_target, prime_strength) %>%
  summarize(proportion=mean(strong_response_bool), ci_low=ci.low(strong_response_bool), ci_high = ci.high(strong_response_bool)) %>%
  ungroup() %>%
  mutate(ymin = proportion-ci_low, ymax = proportion+ci_high)

ggplot(data=aggr, aes(x=prime_strength, y=proportion, fill=prime_strength))+
  geom_bar(stat="identity")+
  geom_errorbar(aes(ymin=ymin, ymax=ymax), width=0.2)+
  facet_wrap(~prime_target)



head(aggr)



with_and_between = glmer(strong_response_bool ~ 1 + prime_strength*within_between + (1 + prime_strength*within_between|workerid), data=dataset, family="binomial")
summary(with_and_between)

with_trimmed = dataset[grep("within", dataset$within_between),]
head(with_trimmed)
with_only = glmer(strong_response_bool ~ 1 + prime_strength*prime_type + (1 + prime_strength*prime_type|workerid), data=with_trimmed, family="binomial")
summary(with_only)

betw_trimmed = dataset[grep("between", dataset$within_between),]
head(betw_trimmed)

betw_only = glmer(strong_response_bool ~ 1 + prime_strength*prime_target + (1 + prime_strength*prime_target|workerid), data=betw_trimmed, family="binomial")
summary(betw_only)

# If your data isn't comma-separated, you can use read.table() instead.
#wordinfo = read.table("data/wordinfo.csv", sep=",", header=T)
#head(wordinfo)

# In order to conduct our regression analysis, we need to
# a) get wide into long format
# b) add word info (frequency, family size).

# We can easily switch between long and wide format using the gather() and spread() functions from the tidyr package.
long = wide %>%
  gather(prime_type,prime_strength) %>%
head(long)

# 1. We just sorted the resulting long format by Subject. Sort it by Word instead.
long = wide %>%
  gather(Word,RT,-Subject,-Sex,-NativeLanguage) %>%
  arrange(Word)
head(long)

# We can add word level information to the long format using merge()  
lexdec = merge(long,wordinfo,by=c("Word"),all.x=T)
head(lexdec)

# Are we sure the data.frames got merged correctly? Let's inspect a few cases.
wordinfo[wordinfo$Word == "almond",]

# 2. Convince yourself that the information got correctly added by testing a few more cases.
wordinfo[wordinfo$Word == "melon",]
wordinfo[wordinfo$Word == "walnut",]

# Success! We are ready to run our mixed effects models.
m = lmer(RT ~ Frequency*NativeLanguage + FamilySize + (1 + Frequency + FamilySize | Subject) + (1 + NativeLanguage | Word), data=lexdec)
summary(m)

# Often, we'll want to summarize information by groups. For example, if we want to compute RT means by subject:
subj_means = lexdec %>%
  group_by(Subject) %>%
  summarize(Mean = mean(RT), SD = sd(RT), Max = max(RT))

# 3. Compute RT means by Word instead.
subj_means = lexdec %>%
  group_by(Word) %>%
  summarize(Mean = mean(RT), SD = sd(RT), Max = max(RT))

# Sometimes we want to save data.frames or R console output to a file. For example, we might want to save our newly created lexdec dataset:
write.csv(lexdec,file="data/lexdec_long.csv")

# 3. Using the R help, figure out how to suppress the row.names and the quotes in the output and re-write the file.
write.csv(lexdec,file="data/lexdec_long.csv",row.names=F,quote=F)

# We can also save the console output to a file (for example, if you've run a particularly time-consuming regression analysis you may want to save the model results). 
out = capture.output(summary(m))
out
cat("My awesome results", out, file="data/modeloutput.txt", sep="\n")

# If you want to save the model directly for future use:
save(m,file="data/mymodel.RData")

# You can later reload the model using load()
load("data/mymodel.RData")

# 4. Why was "mymodel.RData" a poorly chosen name for the file? Choose a better name.
# Because load() loads the object with its original variable name. If you load an object for the first time months after you saved it, you may not remember what you called it. For that reason it's advisable to save models in files that are named after the model, e.g.:
save(m,file="data/m.RData")